using Microsoft.AspNetCore.Mvc;

using StudentCareSystem.Application.Commons.Interfaces;
using StudentCareSystem.Application.Commons.Interfaces.Jobs;
using StudentCareSystem.Application.Commons.Models.Apis;
using StudentCareSystem.Application.Commons.Models.Defers;
using StudentCareSystem.Domain.Constants;
using StudentCareSystem.Domain.Enums;
using StudentCareSystem.Domain.Helpers;
using StudentCareSystem.Infrastructure.Attributes;

namespace StudentCareSystem.API.Controllers;

public class StudentDefersController(
    IStudentDeferService studentDeferService,
    IJobService jobService
) : BaseController
{
    [HttpGet]
    [RequiredPermission(PermissionType.ReadStudentDefer)]
    public async Task<IActionResult> GetAll([FromQuery] StudentDeferFilter filter)
    {
        var studentDefers = await studentDeferService.GetAllWithPaginationAsync(filter);
        return Ok(new ApiResponse<Pagination<GetStudentDeferDto>>(
            200,
            MessageDescription.ApiResponseMessageDescription.Success,
            studentDefers));
    }

    [HttpGet("last-updated-date")]
    [RequiredPermission(PermissionType.ReadStudentDefer)]
    public async Task<IActionResult> GetLastUpdatedDate()
    {
        var lastUpdatedDate = await studentDeferService.GetLastUpdatedDateAsync();
        return Ok(new ApiResponse<DateTime?>(
            200,
            MessageDescription.ApiResponseMessageDescription.Success,
            lastUpdatedDate));
    }

    [HttpPost("scan")]
    [RequiredPermission(PermissionType.ScanData)]
    [ProducesResponseType(typeof(ApiResponse<string>), 200)]
    public IActionResult RunDeferScanManually(ApiRequest<ScanDeferRequest> request)
    {
        jobService.ExecuteDeferScanManually(request.Data);
        return Ok(new ApiResponse<string>(
            200,
            MessageDescription.ApiResponseMessageDescription.Success,
            "Defer scan started"));
    }
}
