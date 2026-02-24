using System;
using Application.Core;
using Application.Interfaces;
using Domain;
using MediatR;
using Persistence;

namespace Application.Profiles.Commands;

public class FollowToggle
{
    public class Command : IRequest<Result<Unit>>
    {
        public string TargetUserId { get; set; }
    }

    public class Handler(AppDbContext context, IUserAccessor userAccessor)
    : IRequestHandler<Command, Result<Unit>>
    {
        public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
        {
            var observer = await userAccessor.GetUserAsync(); // obtain the observer user (the current user)
            var target = await context.Users.FindAsync([request.TargetUserId], cancellationToken); // obtain the target user

            if (target == null) return Result<Unit>.Failure("Target user not found", 400);

            // obtain the following status by querying if the PK exists
            var following = await context.UserFollowings 
                .FindAsync([observer.Id, target.Id], cancellationToken);

            if (following == null)
            {
                context.UserFollowings.Add(new UserFollowing
                {
                    ObserverId = observer.Id,
                    TargetId = target.Id
                });
            }
            else context.UserFollowings.Remove(following);

            return await context.SaveChangesAsync(cancellationToken) > 0
                ? Result<Unit>.Success(Unit.Value)
                : Result<Unit>.Failure("Problem updating following", 400);
        }
    }
}
