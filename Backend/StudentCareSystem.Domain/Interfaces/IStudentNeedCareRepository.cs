using StudentCareSystem.Domain.Entities;

namespace StudentCareSystem.Domain.Interfaces;

public interface IStudentNeedCareRepository : IBaseRepository<StudentNeedCare>
{
    Task<StudentNeedCare?> GetByStudentCodeAsync(string studentCode);
    Task<IEnumerable<StudentNeedCare>> GetAllBySemesterAsync(string semesterName);
}
