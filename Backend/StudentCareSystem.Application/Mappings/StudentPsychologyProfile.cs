using StudentCareSystem.Application.Commons.Models.StudentPsychologies;
using StudentCareSystem.Domain.Entities;

namespace StudentCareSystem.Application.Mappings;

public class StudentPsychologyProfile : MapProfile
{
    public StudentPsychologyProfile()
    {
        CreateMap<StudentPsychology, GetStudentPsychologyDto>();
        CreateMap<CreateStudentPsychologyDto, StudentPsychology>();
    }
}
