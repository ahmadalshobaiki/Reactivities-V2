using Application.Core;
using Application.Interfaces;
using Application.Profiles.DTOs;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Profiles.Queries;

public class GetFollowings
{
    public class Query : IRequest<Result<List<UserProfile>>>
    {
        public string Predicate { get; set; } = "followers";
        public required string UserId { get; set; }
    }

    public class Handler(AppDbContext context, IMapper mapper, IUserAccessor userAccessor) : IRequestHandler<Query, Result<List<UserProfile>>>
    {
        public async Task<Result<List<UserProfile>>> Handle(Query request, CancellationToken cancellationToken)
        {
            var profiles = new List<UserProfile>();

            switch (request.Predicate)
            {
                case "followers":
                    profiles = await context.UserFollowings.Where(x => x.TargetId == request.UserId) // as the followee
                        .Select(x => x.Observer) // select my followers
                        .ProjectTo<UserProfile>(mapper.ConfigurationProvider, 
                            new {currentUserId = userAccessor.GetUserId()}) // project to UserProfile
                        .ToListAsync(cancellationToken);
                    break;
                case "followings":
                    profiles = await context.UserFollowings.Where(x => x.ObserverId == request.UserId) // as the follower
                        .Select(x => x.Target) // select my followings
                        .ProjectTo<UserProfile>(mapper.ConfigurationProvider, 
                            new {currentUserId = userAccessor.GetUserId()}) // project to UserProfile
                        .ToListAsync(cancellationToken);
                    break;
            }

            return Result<List<UserProfile>>.Success(profiles);
        }
    }
}
