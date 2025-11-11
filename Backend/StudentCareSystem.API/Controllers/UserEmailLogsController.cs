using Microsoft.AspNetCore.Mvc;

using StudentCareSystem.Application.Commons.Interfaces;
using StudentCareSystem.Application.Commons.Models.Apis;
using StudentCareSystem.Application.Commons.Models.UserEmailLogs;
using StudentCareSystem.Domain.Constants;
using StudentCareSystem.Domain.Enums;
using StudentCareSystem.Domain.Helpers;
using StudentCareSystem.Infrastructure.Attributes;

namespace StudentCareSystem.API.Controllers;

public class UserEmailLogsController(
    IUserEmailLogService UseremailLogService
) : BaseController
{
    [HttpGet]
    [RequiredPermission(PermissionType.ReadEmailLog)]
    public async Task<IActionResult> GetAll([FromQuery] UserEmailLogFilter filter)
    {
        var UseremailLogs = await UseremailLogService.GetAllWithPaginationAsync(filter);
        return Ok(new ApiResponse<Pagination<GetUserEmailLogDto>>(
            200,
            MessageDescription.ApiResponseMessageDescription.Success,
            UseremailLogs));
    }

    [HttpGet("{id}")]
    [RequiredPermission(PermissionType.ReadEmailLog)]
    public async Task<IActionResult> GetById(Guid id)
    {
        var UseremailLog = await UseremailLogService.GetByIdAsync(id);
        return Ok(new ApiResponse<GetUserEmailLogDetailDto>(
            200,
            MessageDescription.ApiResponseMessageDescription.Success,
            UseremailLog));
    }
}
