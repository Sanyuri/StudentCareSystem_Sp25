using Microsoft.AspNetCore.Mvc;

using StudentCareSystem.Application.Commons.Interfaces;
using StudentCareSystem.Application.Commons.Interfaces.Jobs;
using StudentCareSystem.Application.Commons.Models.Apis;
using StudentCareSystem.Application.Commons.Models.Defers;
using StudentCareSystem.Application.Commons.Models.Emails;
using StudentCareSystem.Domain.Constants;

namespace StudentCareSystem.API.Controllers;

public class EmailController(
    IEmailService emailService,
    IJobService jobService
) : BaseController
{

    [HttpPost("Send-Deferral-Email")]
    public async Task<IActionResult> SendDeferralEmail(ApiRequest<SendDeferEmailDto> sendDeferEmailDto)
    {
        await emailService.SendStudentDeferAsync(sendDeferEmailDto.Data);
        return Ok(new ApiResponse<string>(
            200,
            MessageDescription.ApiResponseMessageDescription.Success,
            "Email sent successfully"));
    }

    /// <summary>
    /// Sends an attendance notification email manually.
    /// </summary>
    /// <param name="sendAttendanceNotificationRequest">The request containing the data needed to send the attendance notification email.</param>
    /// <returns>An IActionResult indicating the result of the operation.</returns>
    /// <response code="200">Email sent successfully.</response>
    [ProducesResponseType(typeof(ApiResponse<string>), 200)]
    [HttpPost("Send-Attendance-Email")]
    public IActionResult SendAttendanceEmail(ApiRequest<SendAttendanceNotificationRequest> sendAttendanceNotificationRequest)
    {
        jobService.ExecuteSendAttendanceNotificationManually(sendAttendanceNotificationRequest.Data);
        return Ok(new ApiResponse<string>(
            200,
            MessageDescription.ApiResponseMessageDescription.Success,
            "Email sent successfully"));
    }

    /// <summary>
    /// Sends a failed subject notification email manually.
    /// </summary>
    /// <param name="sendFailedSubjectEmailDto">The request containing the data needed to send the failed subject notification email.</param>
    /// <returns>An IActionResult indicating the result of the operation.</returns>
    /// <response code="200">Email sent successfully.</response>
    [ProducesResponseType(typeof(ApiResponse<string>), 200)]
    [HttpPost("Send-Failed-Subject-Email")]
    public IActionResult SendFailedSubjectEmail(ApiRequest<SendFailedSubjectEmailDto> sendFailedSubjectEmailDto)
    {
        jobService.ExecuteSendFailedSubjectNotificationManually(sendFailedSubjectEmailDto.Data);
        return Ok(new ApiResponse<string>(
            200,
            MessageDescription.ApiResponseMessageDescription.Success,
            "Email sent successfully"));
    }
}
