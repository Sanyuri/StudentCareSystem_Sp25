using StudentCareSystem.Domain.Entities;
using StudentCareSystem.Domain.Enums;

namespace StudentCareSystem.Domain.Interfaces;

public interface IStudentRepository : IBaseRepository<Student>
{
    Task<Student?> GetByStudentCodeAsync(string studentCode);
    Task<List<string>> GetAllStudentCodeByStatusCodesAsync(IEnumerable<StudentStatus> statusCodes);
    Task<List<string>> GetAllStudentCodeAsync();
    Task<IEnumerable<Student>> GetAllStudentsInStudentCodesAsync(IEnumerable<string> studentCodes, IEnumerable<StudentStatus>? statusCodes = null);
}
