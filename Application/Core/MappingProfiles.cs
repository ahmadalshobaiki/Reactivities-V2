using System;
using Application.Activities.DTO;
using AutoMapper;
using Domain;

namespace Application.Core;

public class MappingProfiles : Profile
{
    public MappingProfiles()
    {
        CreateMap<Activity, Activity>();
        CreateMap<CreateActivityDTO, Activity>();
        CreateMap<EditActivityDTO, Activity>();
    }
}
