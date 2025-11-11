using StudentCareSystem.Domain.Entities;
using StudentCareSystem.Infrastructure.Models.Attendances;
using StudentCareSystem.Infrastructure.Models.StudentLeaveApplications;
using StudentCareSystem.Infrastructure.Models.StudentPoints;
using StudentCareSystem.Infrastructure.Models.Students;
using StudentCareSystem.Infrastructure.Models.StudentSubjects;
using StudentCareSystem.Infrastructure.Models.Subjects;

namespace StudentCareSystem.Infrastructure.ExternalServices;

public interface IFapService
{
    Task<string> GetJwtTokenAsync();
    Task<IEnumerable<FapStudentAttendanceData>> GetAttendancesAsync(DateTime startDate, DateTime endDate, IEnumerable<string> rollNumbers);
    Task<IEnumerable<FapStudentDeferData>> GetStudentDefersAsync(DateTime startDate, DateTime endDate);
    Task<IEnumerable<Semester>> GetSemestersAsync();
    Task<FapStudentDetail?> GetStudentDetailAsync(string rollNumber);
    Task<int> GetTotalStudentRecordsAsync();
    Task<IEnumerable<FapStudentData>> GetStudentsAsync(int pageSize, int currentPage);
    Task<IEnumerable<FapSubjectData>> GetFapSubjectsAsync();
    Task<IEnumerable<FapStudentPoint>> GetStudentPointsAsync(IEnumerable<string> rollNumbers);
    Task<IEnumerable<FapStudentSubject>> GetStudentSubjectsAsync(IEnumerable<string> rollNumbers, DateTime? startDate = null, DateTime? endDate = null);
}
