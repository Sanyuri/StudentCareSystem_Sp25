using StudentCareSystem.Application.Commons.Models.Points;
using StudentCareSystem.Domain.Helpers;

namespace StudentCareSystem.Application.Commons.Interfaces;

public interface IStudentSubjectService
{
    Task ScanStudentSubjectAsync();
    Task<DateTime?> GetLastUpdatedDateAsync();
}
