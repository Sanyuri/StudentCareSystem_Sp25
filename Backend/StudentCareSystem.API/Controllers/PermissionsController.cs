using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

using StudentCareSystem.Application.Commons.Interfaces;
using StudentCareSystem.Application.Commons.Models.Apis;
using StudentCareSystem.Application.Commons.Models.Permissions;
using StudentCareSystem.Domain.Constants;
using StudentCareSystem.Domain.Enums;
using StudentCareSystem.Infrastructure.Attributes;

namespace StudentCareSystem.API.Controllers;

public class PermissionsController(IPermissionService permissionService) : BaseController
{

    [HttpGet]
    [RequiredPermission(PermissionType.ReadPermission)]
    public async Task<IActionResult> GetAll()
    {
        var permissions = await permissionService.GetAllAsync();
        var response = new ApiResponse<IEnumerable<GetPermissionDto>>(
            200,
            MessageDescription.ApiResponseMessageDescription.Success,
            permissions);
        return Ok(response);
    }

    [HttpGet("{roleId}")]
    [RequiredPermission(PermissionType.ReadPermission)]
    public async Task<IActionResult> GetByRole(Guid roleId)
    {
        var permissions = await permissionService.GetByRoleAsync(roleId);
        var response = new ApiResponse<IEnumerable<GetPermissionDto>>(
            200,
            MessageDescription.ApiResponseMessageDescription.Success,
            permissions);
        return Ok(response);
    }

    [HttpPost("auto-set-permissions")]
    [RequiredPermission(PermissionType.OnlyForAdmin)]
    public async Task<IActionResult> AutoSetPermissionsForRole()
    {
        await permissionService.AutoSetPermissionsForRoleAsync();
        return Ok(new ApiResponse<string>(
            200,
            MessageDescription.ApiResponseMessageDescription.Success,
            "Auto set permissions for role successfully"));
    }

}
