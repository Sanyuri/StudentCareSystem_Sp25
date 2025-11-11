using StudentCareSystem.Domain.Entities;

namespace StudentCareSystem.Domain.Interfaces;

public interface ISubjectRepository : IBaseRepository<Subject>
{
    Task<List<Subject>> GetAllWithAttendanceAsync();
}
