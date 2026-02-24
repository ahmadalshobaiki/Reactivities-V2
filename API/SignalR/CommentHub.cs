using System;
using Application.Activities.Commands;
using Application.Activities.Queries;
using MediatR;
using Microsoft.AspNetCore.SignalR;

namespace API.SignalR;

// SignalR Hub (or a Websocket Controller). The endpoint that clients connect to and maintain a persistent connection with to enable a bi-directional communication between client and server
public class CommentHub(IMediator mediator) : Hub 
{
    // function so that clients connected to the SignalR Hub can send comments to the group
    public async Task SendComment(AddComment.Command command)
    {
        var comment = await mediator.Send(command);

        await Clients.Group(command.ActivityId).SendAsync("ReceiveComment", comment.Value); // From clients perspective
    }

    public override async Task OnConnectedAsync() // function override for when a client connects to add them to a SignalR group based on the activityId and when a new comment is added, propagate it to all clients in the same group
    {
        // The initial connection is made through HTTP then the connectiton is persisted through websockets
        // First obtain the query id from the HTTP request to be the basis for the group
        var httpContext =  Context.GetHttpContext();
        var activityId = httpContext?.Request.Query["activityId"];

        if (string.IsNullOrEmpty(activityId)) throw new HubException("No Activity with this id");

        // Then assign the connection of that client to the group
        await Groups.AddToGroupAsync(Context.ConnectionId, activityId!);

        // Obtain a list of comments associated with the activity to be sent to the clients
        var result = await mediator.Send(new GetComments.Query{ActivityId=activityId});

        // Send the list of comments associated with the activity to the clients
        await Clients.Caller.SendAsync("LoadComments", result.Value);
    }
}
