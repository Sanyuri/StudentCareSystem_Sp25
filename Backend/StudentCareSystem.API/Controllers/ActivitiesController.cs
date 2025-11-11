using Microsoft.AspNetCore.Mvc;

using StudentCareSystem.Application.Commons.Interfaces;
using StudentCareSystem.Application.Commons.Models.Activities;
using StudentCareSystem.Application.Commons.Models.Apis;
using StudentCareSystem.Domain.Constants;
using StudentCareSystem.Domain.Enums;
using StudentCareSystem.Domain.Helpers;
using StudentCareSystem.Infrastructure.Attributes;

namespace StudentCareSystem.API.Controllers;


public class ActivitiesController(IActivityService activityService) : BaseController
{
    private readonly IActivityService _activityService = activityService;
    /// <summary>
    /// Get all user activities
    /// <returns></returns>
    /// </summary>
    [HttpGet]
    [RequiredPermission(PermissionType.ReadActivity)]
    public async Task<IActionResult> GetAll([FromQuery] ActivityFilter filter)
    {
        var activities = await _activityService.GetAllWithPaginationAsync(filter);
        return Ok(new ApiResponse<Pagination<ActivitiesDto>>(
            200,
            MessageDescription.ApiResponseMessageDescription.Success,
            activities));
    }
}

