using Microsoft.AspNetCore.Mvc;

using StudentCareSystem.Application.Commons.Interfaces;
using StudentCareSystem.Application.Commons.Models.Apis;
using StudentCareSystem.Application.Commons.Models.EmailLogs;
using StudentCareSystem.Domain.Constants;
using StudentCareSystem.Domain.Enums;
using StudentCareSystem.Domain.Helpers;
using StudentCareSystem.Infrastructure.Attributes;

namespace StudentCareSystem.API.Controllers;

public class EmailLogsController(
    IEmailLogService emailLogService
) : BaseController
{
    [HttpGet]
    [RequiredPermission(PermissionType.ReadEmailLog)]
    public async Task<IActionResult> GetAll([FromQuery] EmailLogFilter filter)
    {
        var emailLogs = await emailLogService.GetAllWithPaginationAsync(filter);
        return Ok(new ApiResponse<Pagination<GetEmailLogDto>>(
            200,
            MessageDescription.ApiResponseMessageDescription.Success,
            emailLogs));
    }

    [HttpGet("{id}")]
    [RequiredPermission(PermissionType.ReadEmailLog)]
    public async Task<IActionResult> GetById(Guid id)
    {
        var emailLog = await emailLogService.GetByIdAsync(id);
        return Ok(new ApiResponse<GetEmailLogDetailDto>(
            200,
            MessageDescription.ApiResponseMessageDescription.Success,
            emailLog));
    }
}
