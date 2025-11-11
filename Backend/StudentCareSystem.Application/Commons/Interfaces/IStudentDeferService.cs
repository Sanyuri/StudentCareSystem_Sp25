using StudentCareSystem.Application.Commons.Models.Defers;
using StudentCareSystem.Domain.Entities;
using StudentCareSystem.Domain.Helpers;

namespace StudentCareSystem.Application.Commons.Interfaces;

public interface IStudentDeferService
{
    Task ScanStudentDeferBySemesterAsync(Semester semester);
    Task<DateTime?> GetLastUpdatedDateAsync();
    Task<Pagination<GetStudentDeferDto>> GetAllWithPaginationAsync(StudentDeferFilter filter);
}
