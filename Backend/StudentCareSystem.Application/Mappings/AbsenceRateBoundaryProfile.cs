using StudentCareSystem.Application.Commons.Models.AbsenceRateBoundaries;
using StudentCareSystem.Domain.Entities;

namespace StudentCareSystem.Application.Mappings;

public class AbsenceRateBoundaryProfile : MapProfile
{
    public AbsenceRateBoundaryProfile()
    {
        CreateMap<AbsenceRateBoundary, GetAbsenceRateBoundaryDto>();
        CreateMap<CreateAbsenceRateBoundaryDto, AbsenceRateBoundary>();
        CreateMap<UpdateAbsenceRateBoundaryDto, AbsenceRateBoundary>();

    }
}
