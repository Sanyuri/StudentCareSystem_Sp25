
using StudentCareSystem.Application.Commons.Models.Applications;
using StudentCareSystem.Domain.Entities;

namespace StudentCareSystem.Application.Mappings;
public class StudentApplicationProfile : MapProfile
{
    public StudentApplicationProfile()
    {
        CreateMap<StudentApplication, GetStudentApplicationDto>();
        CreateMap<CreateStudentApplicationDto, StudentApplication>();
    }
}
