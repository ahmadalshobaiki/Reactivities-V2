using System;
using Application.Activities.Commands;
using Application.Activities.DTO;
using Application.Activities.Queries;
using Application.Core;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace API.Controllers;

public class ActivitiesController() : BaseApiController
{
    // API Controllers parameter mapping can be from the query string, route variables, or body of the request. simple types = query string or route variables. complex objects = body. This is called Model Binding.
    [HttpGet]
    public async Task<ActionResult<PagedList<ActivityDTO, DateTime?>>> GetActivities(
        [FromQuery]ActivityParams activityParams) // [FromQuery] since the API controller by default will be looking this up from the body of the request to find these, but we will send this as part of the query url
    {
        return HandleResult(await Mediator.Send(new GetActivityList.Query{Params = activityParams}));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ActivityDTO>> GetActivityDetail(string id)
    {
        return HandleResult(await Mediator.Send(new GetActivityDetails.Query
        {
            Id = id
        }));
    }

    [HttpPost]
    public async Task<ActionResult<string>> CreateActivity(CreateActivityDTO activityDTO)
    {
        return HandleResult(await Mediator.Send(new CreateActivity.Command
        {
            ActivityDTO = activityDTO
        }));
    }

    [HttpPut("{id}")]
    [Authorize(Policy = "IsActivityHost")]
    public async Task<ActionResult<string>> EditActivity(string id, EditActivityDTO activityDTO)
    {
        activityDTO.Id = id;
        return HandleResult(await Mediator.Send(new EditActivity.Command
        {
            ActivityDTO = activityDTO
        }));
    }

    [HttpDelete("{id}")]
    [Authorize(Policy = "IsActivityHost")]
    public async Task<ActionResult> DeleteActivity(string id)
    {
        return HandleResult(await Mediator.Send(new DeleteActivity.Command
        {
            Id = id
        }));
    }

    [HttpPost("{id}/attend")]
    public async Task<ActionResult> Attend(string id)
    {
        return HandleResult(await Mediator.Send(new UpdateAttendance.Command{Id = id}));
    }
}
