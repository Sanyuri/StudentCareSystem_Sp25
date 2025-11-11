using Microsoft.AspNetCore.Mvc;

using StudentCareSystem.Application.Commons.Interfaces;
using StudentCareSystem.Application.Commons.Models.Apis;
using StudentCareSystem.Application.Commons.Models.ProgressCriterionTypes;
using StudentCareSystem.Domain.Constants;
using StudentCareSystem.Domain.Enums;
using StudentCareSystem.Infrastructure.Attributes;

namespace StudentCareSystem.API.Controllers;

public class ProgressCriterionTypesController(
    IProgressCriterionTypeService progressCriterionTypeService
) : BaseController
{
    /// <summary>
    /// Get all progress criterion types.
    /// </summary>
    /// <returns>A list of progress criterion types.</returns>
    [HttpGet]
    [RequiredPermission(PermissionType.ReadProgressCriterionType)]
    public async Task<IActionResult> GetAll()
    {
        var criterionTypes = await progressCriterionTypeService.GetAllAsync();
        return Ok(new ApiResponse<IEnumerable<GetProgressCriterionTypeDto>>(
            200,
            MessageDescription.ApiResponseMessageDescription.Success,
            criterionTypes));
    }

    /// <summary>
    /// Get a progress criterion type by ID.
    /// </summary>
    /// <param name="id">The ID of the progress criterion type.</param>
    /// <returns>The progress criterion type with the specified ID.</returns>
    [HttpGet("{id}")]
    [RequiredPermission(PermissionType.ReadProgressCriterionType)]
    public async Task<IActionResult> GetById(Guid id)
    {
        var criterionType = await progressCriterionTypeService.GetByIdAsync(id);
        return Ok(new ApiResponse<GetProgressCriterionTypeDto>(
            200,
            MessageDescription.ApiResponseMessageDescription.Success,
            criterionType));
    }

    /// <summary>
    /// Add a new progress criterion type.
    /// </summary>
    /// <param name="createProgressCriterionTypeDto">The data for the new progress criterion type.</param>
    /// <returns>The created progress criterion type.</returns>
    [HttpPost]
    [RequiredPermission(PermissionType.WriteProgressCriterionType)]
    public async Task<IActionResult> Add(ApiRequest<CreateProgressCriterionTypeDto> createProgressCriterionTypeDto)
    {
        var criterionType = await progressCriterionTypeService.AddAsync(createProgressCriterionTypeDto.Data);
        return CreatedAtAction(nameof(GetById), new { id = criterionType.Id },
            new ApiResponse<GetProgressCriterionTypeDto>(
                201,
                MessageDescription.ApiResponseMessageDescription.Created,
                criterionType));
    }

    /// <summary>
    /// Update an existing progress criterion type.
    /// </summary>
    /// <param name="updateProgressCriterionTypeDto">The data for updating the progress criterion type.</param>
    /// <param name="id">The ID of the progress criterion type to update.</param>
    /// <returns>No content.</returns>
    [HttpPut("{id}")]
    [RequiredPermission(PermissionType.WriteProgressCriterionType)]
    public async Task<IActionResult> Update(ApiRequest<UpdateProgressCriterionTypeDto> updateProgressCriterionTypeDto, Guid id)
    {
        if (updateProgressCriterionTypeDto.Data.Id != id)
        {
            return BadRequest(new ApiResponse<GetProgressCriterionTypeDto>(
                400,
                MessageDescription.ApiResponseMessageDescription.IdMismatch,
                null));
        }
        await progressCriterionTypeService.UpdateAsync(updateProgressCriterionTypeDto.Data);
        return Ok(new ApiResponse<GetProgressCriterionTypeDto>(
            200,
            MessageDescription.ApiResponseMessageDescription.Updated,
            null));
    }

    /// <summary>
    /// Delete a progress criterion type by ID.
    /// </summary>
    /// <param name="id">The ID of the progress criterion type to delete.</param>
    /// <returns>No content.</returns>
    [HttpDelete("{id}")]
    [RequiredPermission(PermissionType.WriteProgressCriterionType)]
    public async Task<IActionResult> Delete(Guid id)
    {
        await progressCriterionTypeService.DeleteAsync(id);
        return Ok(new ApiResponse<GetProgressCriterionTypeDto>(
            200,
            MessageDescription.ApiResponseMessageDescription.Deleted,
            null));
    }
}
