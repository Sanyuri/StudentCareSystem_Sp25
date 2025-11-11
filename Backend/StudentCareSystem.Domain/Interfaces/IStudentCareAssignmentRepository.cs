using StudentCareSystem.Domain.Entities;
using StudentCareSystem.Domain.Enums;

namespace StudentCareSystem.Domain.Interfaces;

public interface IStudentCareAssignmentRepository : IBaseRepository<StudentCareAssignment>
{
    Task<Dictionary<User, Dictionary<CareStatus, int>>> GetAssignmentCountByUserBySemestername(string semesterName);
}
