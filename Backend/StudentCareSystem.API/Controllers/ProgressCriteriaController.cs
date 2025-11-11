using Microsoft.AspNetCore.Mvc;

using StudentCareSystem.Application.Commons.Interfaces;
using StudentCareSystem.Application.Commons.Models.Apis;
using StudentCareSystem.Application.Commons.Models.ProgressCriteria;
using StudentCareSystem.Domain.Constants;
using StudentCareSystem.Domain.Enums;
using StudentCareSystem.Infrastructure.Attributes;

namespace StudentCareSystem.API.Controllers;

public class ProgressCriteriaController(
    IProgressCriterionService progressCriterionService
) : BaseController
{
    /// <summary>
    /// Get all progress criteria by student need care ID.
    /// </summary>
    /// <param name="studentNeedCareId">The ID of the student need care.</param>
    /// <returns>A list of progress criteria for the specified student need care.</returns>
    [HttpGet("by-student-need-care/{studentNeedCareId}")]
    [RequiredPermission(PermissionType.ReadStudentCare)]
    public async Task<IActionResult> GetByStudentNeedCareId(Guid studentNeedCareId)
    {
        var progressCriteria = await progressCriterionService.GetByStudentNeedCareIdAsync(studentNeedCareId);
        return Ok(new ApiResponse<IEnumerable<GetProgressCriterionDto>>(
            200,
            MessageDescription.ApiResponseMessageDescription.Success,
            progressCriteria));
    }

    /// <summary>
    /// Add a new progress criterion.
    /// </summary>
    /// <param name="request">The data for the new progress criterion.</param>
    /// <returns>The created progress criterion.</returns>
    [HttpPost]
    [RequiredPermission(PermissionType.WriteStudentCare)]
    public async Task<IActionResult> Add(ApiRequest<CreateProgressCriterionDto> request)
    {
        var progressCriterion = await progressCriterionService.AddAsync(request.Data);
        return Ok(new ApiResponse<GetProgressCriterionDto>(
            201,
            MessageDescription.ApiResponseMessageDescription.Created,
            progressCriterion));
    }

    /// <summary>
    /// Update a progress criterion.
    /// </summary>
    /// <param name="request">The updated progress criterion data.</param>
    /// <returns>A response indicating the success of the operation.</returns>
    [HttpPut]
    [RequiredPermission(PermissionType.WriteStudentCare)]
    public async Task<IActionResult> Update(ApiRequest<UpdateProgressCriterionDto> request)
    {
        await progressCriterionService.UpdateAsync(request.Data);
        return Ok(new ApiResponse<object>(
            200,
            MessageDescription.ApiResponseMessageDescription.Updated,
            null));
    }

    /// <summary>
    /// Update all progress criteria for a student need care.
    /// </summary>
    /// <param name="studentNeedCareId">The ID of the student need care.</param>
    /// <param name="request">The updated progress criteria data.</param>
    /// <returns>A response indicating the success of the operation.</returns>
    [HttpPut("update-all/{studentNeedCareId}")]
    [RequiredPermission(PermissionType.WriteStudentCare)]
    public async Task<IActionResult> UpdateAll(Guid studentNeedCareId, ApiRequest<IEnumerable<UpdateProgressCriterionDto>> request)
    {
        await progressCriterionService.UpdateAllByStudentNeedCareIdAsync(studentNeedCareId, request.Data);
        return Ok(new ApiResponse<object>(
            200,
            MessageDescription.ApiResponseMessageDescription.Updated,
            null));
    }
}
