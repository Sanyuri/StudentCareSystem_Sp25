using StudentCareSystem.Application.Commons.Models.StudentPsychologies;
using StudentCareSystem.Domain.Entities;
using StudentCareSystem.Infrastructure.Models.StudentSubjects;

namespace StudentCareSystem.Application.Mappings;

public class StudentSubjectProfile : MapProfile
{
    public StudentSubjectProfile()
    {
        CreateMap<FapStudentSubject, StudentSubject>()
        .ForMember(opt => opt.StudentCode, src => src.MapFrom(x => x.RollNumber));
    }
}
