using StudentCareSystem.Application.Commons.Models.Attendances;

namespace StudentCareSystem.Application.Commons.Interfaces;

public interface IAttendanceHistoryService
{
    Task<IEnumerable<GetAttendanceHistoryDto>> GetAllByStudentAttendanceIdAsync(Guid studentAttendanceId);
}
