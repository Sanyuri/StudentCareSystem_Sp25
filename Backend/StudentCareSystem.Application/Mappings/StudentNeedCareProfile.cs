using StudentCareSystem.Application.Commons.Models.StudentNeedCares;
using StudentCareSystem.Domain.Entities;

namespace StudentCareSystem.Application.Mappings;

public class StudentNeedCareProfile : MapProfile
{
    public StudentNeedCareProfile()
    {
        CreateMap<StudentNeedCare, GetStudentNeedCareDto>();
        CreateMap<CreateStudentNeedCareDto, StudentNeedCare>();
    }
}
