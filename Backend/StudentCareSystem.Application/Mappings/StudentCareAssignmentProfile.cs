using StudentCareSystem.Application.Commons.Models.StudentNeedCareAssignments;
using StudentCareSystem.Domain.Entities;

namespace StudentCareSystem.Application.Mappings;

public class StudentCareAssignmentProfile : MapProfile
{
    public StudentCareAssignmentProfile()
    {
        CreateMap<StudentCareAssignment, GetStudentCareAssignmentDto>();
    }
}
