using Microsoft.AspNetCore.Mvc;

using StudentCareSystem.Application.Commons.Interfaces;
using StudentCareSystem.Application.Commons.Models.Apis;
using StudentCareSystem.Application.Commons.Models.Attendances;
using StudentCareSystem.Domain.Constants;
using StudentCareSystem.Domain.Enums;
using StudentCareSystem.Infrastructure.Attributes;

namespace StudentCareSystem.API.Controllers;

public class AttendanceHistoriesController(IAttendanceHistoryService attendanceHistoryService) : BaseController
{
    [HttpGet("student-attendance/{studentAttendanceId}")]
    [RequiredPermission(PermissionType.ReadStudentAttendance)]
    public async Task<IActionResult> GetAllByStudentAttendanceId(Guid studentAttendanceId)
    {
        var attendanceHistories = await attendanceHistoryService.GetAllByStudentAttendanceIdAsync(studentAttendanceId);
        var response = new ApiResponse<IEnumerable<GetAttendanceHistoryDto>>(
            200,
            MessageDescription.ApiResponseMessageDescription.Success,
            attendanceHistories);
        return Ok(response);
    }
}
