using Application.Activities.DTO;
using Application.Core;
using Application.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities.Queries;

public class GetActivityList
{
    public class Query : IRequest<Result<PagedList<ActivityDTO, DateTime?>>> // an HTTP Request of type Result<PagedList<ActivityDTO, DateTime>>>
    {
        public required ActivityParams Params { get; set; } // an object used for pagination
    };

    public class Handler(AppDbContext context, IMapper mapper, IUserAccessor userAccessor) : IRequestHandler<Query, Result<PagedList<ActivityDTO, DateTime?>>>
    {

        // query the activities but return only a part of it (paged list)
        public async Task<Result<PagedList<ActivityDTO, DateTime?>>> Handle(Query request, CancellationToken cancellationToken)
        {
            var query = context.Activities
                .OrderBy(x => x.Date)
                // Only fetch the activities where date >= the specified date in the request
                .Where(x => x.Date >= (request.Params.Cursor ?? request.Params.StartDate)) // A ?? B kill switch. if A is null execute B
                .AsQueryable();

            if (!string.IsNullOrEmpty(request.Params.Filter)) // if there is a filter, update the existing query
            {
                // a switch expression
                query = request.Params.Filter switch
                {
                    "isGoing" => query.Where(x => x.Attendees.Any(a =>
                        a.UserId == userAccessor.GetUserId())), // get the activities the current logged in user is attending
                    "isHost" => query.Where(x => x.Attendees.Any(a => a.IsHost && a.UserId == userAccessor.GetUserId())), // get the activities the current logged in user is attending and is the host
                    _ => query // The default option. Returns all the activities (based of the start date) without filtering
                };
            }

            var projectedActivities = query.ProjectTo<ActivityDTO>(mapper.ConfigurationProvider, // project the query into the DTO format
                new { currentUserId = userAccessor.GetUserId()});

            var activities = await projectedActivities
            .Take(request.Params.PageSize + 1) // The actual pagination operator. Here we specify how many we wish to take only from the result of the query + fetch an extra one (which is the last activity)
            .ToListAsync(cancellationToken); // execute the query

            DateTime? nextCursor = null;
            if (activities.Count > request.Params.PageSize) // check if the number of activities returned is more than the specified page size
            {
                nextCursor = activities.Last().Date; // set the nextcursor to be the date of last element returned from the query (which is the extra one we fetched)
                activities.RemoveAt(activities.Count - 1); // and don't return it
            }

            return Result<PagedList<ActivityDTO, DateTime?>>.Success(
                new PagedList<ActivityDTO, DateTime?>
                {
                    Items = activities,
                    NextCursor = nextCursor
                }
            );
        }
    }
}
