using StudentCareSystem.Application.Commons.Models.ProgressCriteria;
using StudentCareSystem.Domain.Entities;


namespace StudentCareSystem.Application.Mappings;

public class ProgressCriterionProfile : MapProfile
{
    public ProgressCriterionProfile()
    {
        CreateMap<ProgressCriterion, GetProgressCriterionDto>();
        CreateMap<CreateProgressCriterionDto, ProgressCriterion>();
    }
}
