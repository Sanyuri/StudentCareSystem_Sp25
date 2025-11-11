using StudentCareSystem.Application.Commons.Models.Points;
using StudentCareSystem.Domain.Helpers;

namespace StudentCareSystem.Application.Commons.Interfaces;

public interface IStudentPointService
{
    Task ScanStudentPointAsync();
    Task<Pagination<GetStudentPointDto>> GetAllWithPaginationAsync(StudentPointFilter filter);
    Task<IEnumerable<GetStudentPointDto>> GetAllStudentPointByStudentCodeAndInSemestersAsync(string studentCode, string[] semesters);
    Task<IEnumerable<GetStudentPointDto>> GetCurrentFailedSubjectByStudentCodeAsync(string studentCode);
    Task<Pagination<GetStudentFailedDto>> GetStudentsWithFailedSubjectsAsync(StudentFailedFilter filter);
    Task<DateTime?> GetLastUpdatedDateAsync();
}
