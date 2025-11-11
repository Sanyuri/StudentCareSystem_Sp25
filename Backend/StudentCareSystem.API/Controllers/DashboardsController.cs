using Microsoft.AspNetCore.Mvc;

using StudentCareSystem.Application.Commons.Interfaces;
using StudentCareSystem.Application.Commons.Models.Apis;
using StudentCareSystem.Application.Commons.Models.Dashboard;
using StudentCareSystem.Domain.Constants;
using StudentCareSystem.Domain.Enums;

namespace StudentCareSystem.API.Controllers;

public class DashboardsController(
  IDashboardService dashboardService
) : BaseController
{
    /// <summary>
    /// Get student total reminder dashboard
    /// </summary>
    /// <returns></returns>
    [HttpGet("student-total-reminder")]
    public async Task<IActionResult> GetTotalReminderDashboardAsync()
    {
        var result = await dashboardService.GetTotalReminderDashboard();
        return Ok(new ApiResponse<DashboardStudentRemindDto>(
          200,
          MessageDescription.ApiResponseMessageDescription.Success,
          result));
    }

    /// <summary>
    /// Get student attendance dashboard
    /// </summary>
    /// <returns></returns>
    [HttpGet("student-attendance")]
    public async Task<IActionResult> GetStudentAttendanceDashboardAsync()
    {
        var result = await dashboardService.GetStudentRemindDashboard(EmailType.AttendanceNotification);
        return Ok(new ApiResponse<DashboardStudentRemindDto>(
          200,
          MessageDescription.ApiResponseMessageDescription.Success,
          result));
    }

    /// <summary>
    /// Get student deferment dashboard
    /// </summary>
    /// <returns></returns>
    [HttpGet("student-deferment")]
    public async Task<IActionResult> GetStudentDefermentDashboardAsync()
    {
        var result = await dashboardService.GetStudentRemindDashboard(EmailType.DeferNotification);
        return Ok(new ApiResponse<DashboardStudentRemindDto>(
          200,
          MessageDescription.ApiResponseMessageDescription.Success,
          result));
    }

    /// <summary>
    /// Get student fail course dashboard
    /// </summary>
    /// <returns></returns>
    [HttpGet("student-failed-course")]
    public async Task<IActionResult> GetStudentFailCourseDashboardAsync()
    {
        var result = await dashboardService.GetStudentRemindDashboard(EmailType.FailedSubjectNotification);
        return Ok(new ApiResponse<DashboardStudentRemindDto>(
          200,
          MessageDescription.ApiResponseMessageDescription.Success,
          result));
    }

    /// <summary>
    /// Get total application statistic dashboard
    /// </summary>
    /// <returns></returns>
    [HttpGet("total-application")]
    public async Task<IActionResult> GetTotalApplicationDashboardAsync()
    {
        var result = await dashboardService.GetTotalApplicationDashboard();
        return Ok(new ApiResponse<DashboardTotalApplicationDto>(
          200,
          MessageDescription.ApiResponseMessageDescription.Success,
          result));
    }

    /// <summary>
    /// Get application by weekly, monthly, yearly dashboard
    /// </summary>
    /// <param name="request"></param>
    /// <returns></returns>
    [HttpGet("application-by-time")]
    public async Task<IActionResult> GetApplicationByTimeDashboardAsync([FromQuery] DashboardApplicationByTimeRequest request)
    {
        var result = await dashboardService.GetApplicationByTimeDashboard(request);
        return Ok(new ApiResponse<IEnumerable<DashboardApplicationByTimeResponse>>(
          200,
          MessageDescription.ApiResponseMessageDescription.Success,
          result));
    }

    /// <summary>
    /// Get student reminder by time dashboard
    /// </summary>
    /// <param name="request"></param>
    /// <returns></returns>
    [HttpGet("student-reminder-by-time")]
    public async Task<IActionResult> GetStudentReminderByTimeDashboardAsync([FromQuery] DashboardStudentRemindRequest request)
    {
        var result = await dashboardService.GetStudentReminderByTimeDashboard(request);
        return Ok(new ApiResponse<IEnumerable<DashboardStudentRemindByTimeResponse>>(
          200,
          MessageDescription.ApiResponseMessageDescription.Success,
          result));
    }

    /// <summary>
    /// Get student cared information dashboard
    /// </summary>
    /// <returns></returns>
    [HttpGet("student-cared")]
    public async Task<IActionResult> GetStudentCaredDashboardAsync()
    {
        var result = await dashboardService.GetStudentCaredDashboard();
        return Ok(new ApiResponse<DashboardStudentCaredDto>(
          200,
          MessageDescription.ApiResponseMessageDescription.Success,
          result));
    }

    /// <summary>
    /// Get email log by time dashboard
    /// </summary>
    /// <param name="request"></param>
    /// <returns></returns>
    [HttpGet("email-log-by-time")]
    public async Task<IActionResult> GetEmailLogByTimeDashboardAsync([FromQuery] DashboardEmailLogByTimeRequest request)
    {
        var result = await dashboardService.GetEmailLogByTimeDashboard(request);
        return Ok(new ApiResponse<IEnumerable<DashboardEmailLogByTimeResponse>>(
          200,
          MessageDescription.ApiResponseMessageDescription.Success,
          result));
    }
}
