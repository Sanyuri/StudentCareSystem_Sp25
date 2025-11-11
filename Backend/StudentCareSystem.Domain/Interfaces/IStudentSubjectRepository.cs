using StudentCareSystem.Domain.Entities;

namespace StudentCareSystem.Domain.Interfaces;

public interface IStudentSubjectRepository : IBaseRepository<StudentSubject>
{
    public Task<IEnumerable<StudentSubject>> GetStudentSubjectsAsync(IEnumerable<string> studentCodes, DateTime? startDate = null, DateTime? endDate = null);
}
