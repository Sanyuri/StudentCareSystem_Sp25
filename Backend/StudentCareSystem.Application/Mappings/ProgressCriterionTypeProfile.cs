using StudentCareSystem.Application.Commons.Models.ProgressCriterionTypes;
using StudentCareSystem.Domain.Entities;

namespace StudentCareSystem.Application.Mappings;

public class ProgressCriterionTypeProfile : MapProfile
{
    public ProgressCriterionTypeProfile()
    {
        CreateMap<ProgressCriterionType, GetProgressCriterionTypeDto>();
        CreateMap<CreateProgressCriterionTypeDto, ProgressCriterionType>();
        CreateMap<UpdateProgressCriterionTypeDto, ProgressCriterionType>();
    }
}
