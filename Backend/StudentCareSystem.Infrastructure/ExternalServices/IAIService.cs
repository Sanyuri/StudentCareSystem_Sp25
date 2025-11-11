using StudentCareSystem.Domain.Helpers;
using StudentCareSystem.Infrastructure.Models.AIs;

namespace StudentCareSystem.Infrastructure.ExternalServices;

public interface IAIService
{
    Task AnalyzeStudentNeedCareAsync(string SemesterName);
    Task<Pagination<StudentResultItem>> GetStudentNeedCareAsync(StudentResultRequest studentResultRequest);
}
