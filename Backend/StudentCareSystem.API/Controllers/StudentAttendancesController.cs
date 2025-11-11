using Microsoft.AspNetCore.Mvc;

using StudentCareSystem.Application.Commons.Interfaces;
using StudentCareSystem.Application.Commons.Interfaces.Jobs;
using StudentCareSystem.Application.Commons.Models.Apis;
using StudentCareSystem.Application.Commons.Models.Attendances;
using StudentCareSystem.Domain.Constants;
using StudentCareSystem.Domain.Enums;
using StudentCareSystem.Domain.Helpers;
using StudentCareSystem.Infrastructure.Attributes;

namespace StudentCareSystem.API.Controllers;

public class StudentAttendancesController(
    IStudentAttendanceService studentAttendanceService,
    IJobService jobService) : BaseController
{
    [HttpGet]
    [RequiredPermission(PermissionType.ReadStudentAttendance)]
    public async Task<IActionResult> GetAll([FromQuery] AttendanceFilter filter)
    {
        var attendances = await studentAttendanceService.GetAllWithPaginationAsync(filter);
        return Ok(new ApiResponse<Pagination<GetStudentAttendanceDto>>(
            200,
            MessageDescription.ApiResponseMessageDescription.Success,
            attendances));
    }

    [HttpGet("student-attendance/{studentCode}")]
    [RequiredPermission(PermissionType.ReadStudentAttendance)]
    public async Task<IActionResult> GetAllStudentAttendanceByStudentCodeInSemesters([FromRoute] string studentCode, [FromQuery] string[] semesters)
    {
        var studentAttendances = await studentAttendanceService.GetAllStudentAttendanceByStudentCodeAndInSemestersAsync(studentCode, semesters);
        return Ok(new ApiResponse<IEnumerable<GetStudentAttendanceDto>>(
            200,
            MessageDescription.ApiResponseMessageDescription.Success,
            studentAttendances));
    }

    /// <summary>
    /// Get all notifications by date with pagination.
    /// </summary>
    /// <param name="filter">The filter criteria for notifications by date.</param>
    /// <returns>A paginated list of notifications by date.</returns>
    [HttpGet("notifications/date")]
    [RequiredPermission(PermissionType.ReadStudentAttendance)]
    public async Task<IActionResult> GetAllNotificationByDateWithPagination([FromQuery] ExportByDateFilter filter)
    {
        var notifications = await studentAttendanceService.GetAllNotificationByDateWithPaginationAsync(filter);
        return Ok(new ApiResponse<Pagination<GetStudentAttendanceDto>>(
            200,
            MessageDescription.ApiResponseMessageDescription.Success,
            notifications));
    }

    /// <summary>
    /// Get all notifications by semester with pagination.
    /// </summary>
    /// <param name="filter">The filter criteria for notifications by semester.</param>
    /// <returns>A paginated list of notifications by semester.</returns>
    [HttpGet("notifications/semester")]
    [RequiredPermission(PermissionType.ReadStudentAttendance)]
    public async Task<IActionResult> GetAllNotificationBySemesterWithPagination([FromQuery] ExportBySemesterFilter filter)
    {
        var notifications = await studentAttendanceService.GetAllNotificationBySemesterWithPaginationAsync(filter);
        return Ok(new ApiResponse<Pagination<GetStudentAttendanceDto>>(
            200,
            MessageDescription.ApiResponseMessageDescription.Success,
            notifications));
    }

    /// <summary>
    /// Get all Student Attendances updated by date with pagination.
    /// </summary>
    /// <param name="filter">The filter criteria for Student Attendances updated by date.</param>
    /// <returns>A paginated list of Student Attendances updated by date.</returns>
    [HttpGet("last-updated")]
    [RequiredPermission(PermissionType.ReadStudentAttendance)]
    public async Task<IActionResult> GetAllUpdatedByDateWithPagination([FromQuery] ExportByDateFilter filter)
    {
        var notifications = await studentAttendanceService.GetAllUpdatedByDateWithPaginationAsync(filter);
        return Ok(new ApiResponse<Pagination<GetStudentAttendanceDto>>(
            200,
            MessageDescription.ApiResponseMessageDescription.Success,
            notifications));
    }

    [HttpGet("last-updated-date")]
    [RequiredPermission(PermissionType.ReadStudentAttendance)]
    public async Task<IActionResult> GetLastUpdatedDateAsync()
    {
        var lastUpdatedDate = await studentAttendanceService.GetLastUpdatedDateAsync();
        return Ok(new ApiResponse<DateTime?>(
            200,
            MessageDescription.ApiResponseMessageDescription.Success,
            lastUpdatedDate));
    }

    [HttpPost("scan")]
    [ProducesResponseType(typeof(ApiResponse<string>), 200)]
    [RequiredPermission(PermissionType.ScanData)]
    public IActionResult RunAttendanceScanManually(ApiRequest<ScanAttendanceRequest> request)
    {
        jobService.ExecuteAttendanceScanManually(request.Data);
        return Ok(new ApiResponse<string>(
            200,
            MessageDescription.ApiResponseMessageDescription.Success,
            "Attendance scan started"));
    }

}
