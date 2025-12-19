using System;
using Application.Activities.Commands;
using Application.Activities.DTO;
using FluentValidation;

namespace Application.Activities.Validators;

// Exception Handling at the DTO (request) level
public class CreateActivityValidator : BaseActivityValidator<CreateActivity.Command, CreateActivityDTO>
{
    public CreateActivityValidator() : base(x => x.ActivityDTO)
    {
    }
}
