using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

using StudentCareSystem.Application.Commons.Interfaces;
using StudentCareSystem.Application.Commons.Models.Apis;
using StudentCareSystem.Application.Commons.Models.Roles;
using StudentCareSystem.Domain.Constants;
using StudentCareSystem.Domain.Enums;
using StudentCareSystem.Infrastructure.Attributes;

namespace StudentCareSystem.API.Controllers;

[AllowAnonymous]
public class RolesController(IRoleService roleService) : BaseController
{
    private readonly IRoleService _roleService = roleService;

    [HttpGet]
    [RequiredPermission(PermissionType.ReadRole)]
    public async Task<IActionResult> GetAll()
    {
        var roles = await _roleService.GetAllAsync();
        var response = new ApiResponse<IEnumerable<GetRoleDto>>(
            200,
            MessageDescription.ApiResponseMessageDescription.Success,
            roles);
        return Ok(response);
    }

    [HttpGet("{id}")]
    [RequiredPermission(PermissionType.ReadRole)]
    public async Task<IActionResult> GetById(Guid id)
    {
        var role = await _roleService.GetByIdAsync(id);
        var response = new ApiResponse<GetRoleDto>(
            200,
            MessageDescription.ApiResponseMessageDescription.Success,
            role);
        return Ok(response);
    }

    // Only admin can create a new role
    // TODO: Add Admin policy for this action
    [HttpPut("{id}")]
    [RequiredPermission(PermissionType.WriteRole)]
    public async Task<IActionResult> Update([FromRoute] Guid id, [FromBody] ApiRequest<UpdateRoleDto> updateRoleDto)
    {
        if (id != updateRoleDto.Data.Id)
        {
            return BadRequest(new ApiResponse<GetRoleDto>(
                400,
                MessageDescription.ApiResponseMessageDescription.BadRequest,
                null));
        }
        var role = await _roleService.UpdateAsync(updateRoleDto.Data);
        var response = new ApiResponse<GetRoleDto>(
            200,
            MessageDescription.ApiResponseMessageDescription.Success,
            role);
        return Ok(response);
    }
}
