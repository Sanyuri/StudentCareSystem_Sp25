using StudentCareSystem.Application.Commons.Models.Activities;
using StudentCareSystem.Domain.Entities;

namespace StudentCareSystem.Application.Mappings;

public class ActivityProfile : MapProfile
{
    public ActivityProfile()
    {
        CreateMap<Activity, ActivitiesDto>()
            .ForMember(d => d.ActivityTypeName, opt => opt.MapFrom(s => s.ActivityType))
            .ForMember(d => d.Description, opt => opt.MapFrom(s => s.ActivityDescription))
            .ReverseMap();
    }
}
