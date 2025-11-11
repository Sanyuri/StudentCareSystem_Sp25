using StudentCareSystem.Application.Commons.Models.Attendances;
using StudentCareSystem.Domain.Entities;
using StudentCareSystem.Domain.Helpers;

namespace StudentCareSystem.Application.Commons.Interfaces;

public interface IStudentAttendanceService
{
    Task<Pagination<GetStudentAttendanceDto>> GetAllWithPaginationAsync(AttendanceFilter filter);
    Task<Pagination<GetStudentAttendanceDto>> GetAllNotificationByDateWithPaginationAsync(ExportByDateFilter filter);
    Task<Pagination<GetStudentAttendanceDto>> GetAllNotificationBySemesterWithPaginationAsync(ExportBySemesterFilter filter);
    Task<IEnumerable<GetStudentAttendanceDto>> GetAllStudentAttendanceByStudentCodeAndInSemestersAsync(string studentCode, string[] semesters);
    Task<Pagination<GetStudentAttendanceDto>> GetAllUpdatedByDateWithPaginationAsync(ExportByDateFilter filter);
    Task<DateTime?> GetLastUpdatedDateAsync();
    Task ScanStudentAttendanceAsync(Semester selectedSemester);
}
