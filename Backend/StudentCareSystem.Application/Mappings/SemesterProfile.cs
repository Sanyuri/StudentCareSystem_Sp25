using StudentCareSystem.Application.Commons.Models.Semesters;
using StudentCareSystem.Domain.Entities;

namespace StudentCareSystem.Application.Mappings;

public class SemesterProfile : MapProfile
{
    public SemesterProfile()
    {
        CreateMap<Semester, SemesterDto>().ReverseMap();
    }
}
