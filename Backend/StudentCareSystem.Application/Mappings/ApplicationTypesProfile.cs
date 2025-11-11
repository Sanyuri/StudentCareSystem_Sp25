using StudentCareSystem.Application.Commons.Models.ApplicationTypes;
using StudentCareSystem.Domain.Entities;

namespace StudentCareSystem.Application.Mappings;

public class ApplicationTypesProfile : MapProfile
{
    public ApplicationTypesProfile()
    {
        CreateMap<ApplicationType, ApplicationTypeResponse>();
        CreateMap<ApplicationTypeRequest, ApplicationType>();
    }
}
