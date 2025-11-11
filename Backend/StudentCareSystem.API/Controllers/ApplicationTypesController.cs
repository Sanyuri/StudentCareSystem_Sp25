using Microsoft.AspNetCore.Mvc;

using StudentCareSystem.Application.Commons.Interfaces;
using StudentCareSystem.Application.Commons.Models.Apis;
using StudentCareSystem.Application.Commons.Models.ApplicationTypes;
using StudentCareSystem.Domain.Constants;
using StudentCareSystem.Domain.Enums;
using StudentCareSystem.Domain.Helpers;
using StudentCareSystem.Infrastructure.Attributes;

namespace StudentCareSystem.API.Controllers;
/// <summary>
/// Handles CRUD operations for application types.
/// </summary>
public class ApplicationTypesController(IApplicationTypeService applicationTypeService) : BaseController
{
    /// <summary>
    /// Retrieves all application types.
    /// </summary>
    /// <returns>A list of all application types.</returns>
    private readonly IApplicationTypeService _applicationTypeService = applicationTypeService;

    /// <summary>
    /// Retrieves a paginated list of application types based on the provided filter.
    /// </summary>
    /// <param name="filter">The filter criteria for retrieving application types.</param>
    /// <returns>A paginated response containing application types that match the filter.</returns>
    [HttpGet]
    [RequiredPermission(PermissionType.ReadApplicationType)]
    public async Task<IActionResult> GetAll()
    {
        var applicationTypes = await _applicationTypeService.GetApplicationTypes();
        return Ok(new ApiResponse<IEnumerable<ApplicationTypeResponse>>(
            200,
            MessageDescription.ApiResponseMessageDescription.Success,
            applicationTypes));
    }

    [HttpGet("all")]
    [RequiredPermission(PermissionType.ReadApplicationType)]
    public async Task<IActionResult> GetAllAsync([FromQuery] ApplicationTypeFilter filter)
    {
        var applicationTypeDtos = await _applicationTypeService.GetAllWithPaginationAsync(filter);
        var response = new ApiResponse<Pagination<ApplicationTypeResponse>>(
            status: 200,
            message: MessageDescription.ApiResponseMessageDescription.Success,
            data: applicationTypeDtos);
        return Ok(response);
    }

    /// <summary>
    /// Get an application type by ID
    /// </summary>
    /// <param name="id"></param>
    /// <returns></returns>
    /// 
    [HttpGet("{id}")]
    [RequiredPermission(PermissionType.ReadApplicationType)]
    public async Task<IActionResult> GetById(Guid id)
    {
        var applicationType = await _applicationTypeService.GetByIdAsync(id);
        return Ok(new ApiResponse<ApplicationTypeResponse>(200, "Application type found", applicationType));
    }

    /// <summary>
    /// Create a new application type
    /// </summary>
    /// <param name="request"></param>
    /// <returns></returns>
    [HttpPost]
    [RequiredPermission(PermissionType.WriteApplicationType)]
    public async Task<IActionResult> Create(ApiRequest<ApplicationTypeRequest> request)
    {
        var applicationType = await _applicationTypeService.AddAsync(request.Data);
        return CreatedAtAction(nameof(GetById), new { id = applicationType.Id }, new ApiResponse<ApplicationTypeResponse>(
            201,
            MessageDescription.ApiResponseMessageDescription.Created,
            applicationType));
    }

    /// <summary>
    /// Update an existing application type
    /// </summary>
    /// <param name="id"></param>
    /// <param name="request"></param>
    /// <returns></returns>
    [HttpPut("{id}")]
    [RequiredPermission(PermissionType.WriteApplicationType)]
    public async Task<IActionResult> Update(Guid id, ApiRequest<ApplicationTypeRequest> request)
    {
        await _applicationTypeService.UpdateAsync(id, request.Data);
        return Ok(new ApiResponse<ApplicationTypeRequest>(
            200,
            MessageDescription.ApiResponseMessageDescription.Updated,
            request.Data));
    }

    /// <summary>
    /// Delete an application type
    /// </summary>
    /// <param name="id"></param>
    /// <returns></returns>
    [HttpDelete("{id}")]
    [RequiredPermission(PermissionType.WriteApplicationType)]
    public async Task<IActionResult> Delete(Guid id)
    {
        await _applicationTypeService.DeleteAsync(id);
        return Ok(new ApiResponse<object>(
            200,
            MessageDescription.ApiResponseMessageDescription.Deleted,
            null));
    }
}
