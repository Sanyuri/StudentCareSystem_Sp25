using StudentCareSystem.Application.Commons.Models.Semesters;

namespace StudentCareSystem.Application.Commons.Interfaces;

public interface ISemesterService
{
    Task<SemesterDto?> GetCurrentSemesterAsync();
    Task<SemesterDto?> GetSemesterByNameAsync(string semesterName);
    Task ScanSemesterAsync();
    Task<IEnumerable<SemesterDto>> GetAllSemestersAsync();
}
