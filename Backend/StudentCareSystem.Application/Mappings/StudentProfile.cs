using System.Text.RegularExpressions;

using StudentCareSystem.Application.Commons.Models.Students;
using StudentCareSystem.Domain.Entities;
using StudentCareSystem.Infrastructure.Models.Students;

namespace StudentCareSystem.Application.Mappings;

public partial class StudentProfile : MapProfile
{
    public StudentProfile()
    {
        CreateMap<FapStudentData, Student>()
        .ForMember(dest => dest.StudentCode, opt => opt.MapFrom(src => src.RollNumber.ToUpper()))
        .ForMember(dest => dest.StudentName, opt => opt.MapFrom(src => src.Fullname))
        .ForMember(dest => dest.Email, opt => opt.MapFrom(src => MyRegex().Replace(src.Email, "")));
        CreateMap<Student, GetStudentDto>();
    }

    [GeneratedRegex(@"\s+")]
    private static partial Regex MyRegex();
}
