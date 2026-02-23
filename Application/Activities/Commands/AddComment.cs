using System;
using Application.Activities.DTO;
using Application.Core;
using Application.Interfaces;
using AutoMapper;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities.Commands;

public class AddComment
{
    public class Command : IRequest<Result<CommentDto>>
    {
        // inputs required from the client
        public required string Body { get; set; }
        public required string ActivityId { get; set; }
    }

    public class Handler(AppDbContext context, IMapper mapper, IUserAccessor userAccessor) 
    : IRequestHandler<Command, Result<CommentDto>>
    {
        public async Task<Result<CommentDto>> Handle(Command request, CancellationToken cancellationToken)
        {
            // obtain the activity with the comments for that activity (1 to many)
            var activity = await context.Activities
                .Include(x => x.Comments)
                .ThenInclude(x => x.User)
                .FirstOrDefaultAsync(x => x.Id == request.ActivityId, cancellationToken);

            if (activity == null) return Result<CommentDto>.Failure("Could not find activity", 404);

            var user = await userAccessor.GetUserAsync();

            var comment = new Comment // Comment object created by enriching the existing Comment Domain model with the inputs from the client
            {
                UserId = user.Id,
                ActivityId = activity.Id,
                Body = request.Body
            };

            activity.Comments.Add(comment);

            var result = await context.SaveChangesAsync(cancellationToken) > 0;

            return result
                ? Result<CommentDto>.Success(mapper.Map<CommentDto>(comment)) // map from Comment domain to CommentDto and return back to the client
                : Result<CommentDto>.Failure("Failed to add comment", 400);
        }
    }
}
