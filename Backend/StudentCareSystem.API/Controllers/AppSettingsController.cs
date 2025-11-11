using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

using StudentCareSystem.Application.Commons.Interfaces;
using StudentCareSystem.Application.Commons.Models.Apis;
using StudentCareSystem.Application.Commons.Models.AppSettings;
using StudentCareSystem.Domain.Constants;
using StudentCareSystem.Domain.Enums;
using StudentCareSystem.Infrastructure.Attributes;

namespace StudentCareSystem.API.Controllers;

/// <summary>
/// Handles CRUD operations for app settings.
/// </summary>
public class AppSettingsController(
    IAppSettingService appSettingService
) : BaseController
{
    /// <summary>
    /// Retrieves all app settings.
    /// </summary>
    /// <returns>A list of all app settings.</returns>
    [HttpGet]
    [AllowAnonymous]
    [SkipChecksum]
    public async Task<IActionResult> GetAll()
    {
        var appSettings = await appSettingService.GetAllAsync();
        return Ok(new ApiResponse<IEnumerable<GetAppSettingDto>>(
            200,
            MessageDescription.ApiResponseMessageDescription.Success,
            appSettings));
    }

    /// <summary>
    /// Get an app setting by ID.
    /// </summary>
    /// <param name="id"></param>
    /// <returns></returns>
    [HttpGet("{id}")]
    [RequiredPermission(PermissionType.ReadAppSetting)]
    public async Task<IActionResult> GetById(Guid id)
    {
        var appSetting = await appSettingService.GetByIdAsync(id);
        return Ok(new ApiResponse<GetAppSettingDto>(
            200,
            "App setting found",
            appSetting));
    }

    /// <summary>
    /// Get an app setting by key.
    /// </summary>
    /// <param name="key"></param>
    /// <returns></returns>
    [HttpGet("key/{key}")]
    [RequiredPermission(PermissionType.ReadAppSetting)]
    public async Task<IActionResult> GetByKey(string key)
    {
        var appSetting = await appSettingService.GetByKeyAsync(key);
        return Ok(new ApiResponse<GetAppSettingDto>(
            200,
            "App setting found",
            appSetting));
    }

    /// <summary>
    /// Create a new app setting.
    /// </summary>
    /// <param name="request"></param>
    /// <returns></returns>
    [HttpPost]
    [RequiredPermission(PermissionType.WriteAppSetting)]
    public async Task<IActionResult> Create(ApiRequest<CreateAppSettingDto> request)
    {
        var appSetting = await appSettingService.AddAsync(request.Data);
        return CreatedAtAction(nameof(GetById), new { id = appSetting.Id }, new ApiResponse<GetAppSettingDto>(
            201,
            MessageDescription.ApiResponseMessageDescription.Created,
            appSetting));
    }

    /// <summary>
    /// Update an existing app setting.
    /// </summary>
    /// <param name="id"></param>
    /// <param name="request"></param>
    /// <returns></returns>
    [HttpPut("{id}")]
    [RequiredPermission(PermissionType.WriteAppSetting)]
    public async Task<IActionResult> Update(Guid id, ApiRequest<UpdateAppSettingDto> request)
    {
        if (request.Data.Id != id)
        {
            return BadRequest(new ApiResponse<UpdateAppSettingDto>(
                400,
                MessageDescription.ApiResponseMessageDescription.IdMismatch,
                null));
        }
        await appSettingService.UpdateAsync(request.Data);
        return Ok(new ApiResponse<UpdateAppSettingDto>(
            200,
            MessageDescription.ApiResponseMessageDescription.Updated,
            request.Data));
    }

    /// <summary>
    /// Delete an app setting.
    /// </summary>
    /// <param name="id"></param>
    /// <returns></returns>
    [HttpDelete("{id}")]
    [RequiredPermission(PermissionType.WriteAppSetting)]
    public async Task<IActionResult> Delete(Guid id)
    {
        await appSettingService.DeleteAsync(id);
        return Ok(new ApiResponse<object>(
            200,
            MessageDescription.ApiResponseMessageDescription.Deleted,
            null));
    }
}
