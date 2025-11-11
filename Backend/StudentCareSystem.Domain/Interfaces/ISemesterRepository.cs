using StudentCareSystem.Domain.Entities;

namespace StudentCareSystem.Domain.Interfaces;

public interface ISemesterRepository : IBaseRepository<Semester>
{
    Task<Semester?> GetSemesterByNameAsync(string semesterName);
    Task<Semester?> GetNextSemesterAsync(Semester currentSemester);
    Task<Semester?> GetPreviousSemesterAsync(Semester currentSemester);
    Task<Semester?> GetCurrentSemesterAsync();
    Task<IEnumerable<string>> GetAllSemesterNamesAsync();
}
