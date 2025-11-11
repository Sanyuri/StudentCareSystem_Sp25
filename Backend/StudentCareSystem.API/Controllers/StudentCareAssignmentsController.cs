using Microsoft.AspNetCore.Mvc;

using StudentCareSystem.Application.Commons.Interfaces;
using StudentCareSystem.Application.Commons.Models.Apis;
using StudentCareSystem.Application.Commons.Models.StudentNeedCareAssignments;
using StudentCareSystem.Domain.Constants;
using StudentCareSystem.Domain.Enums;
using StudentCareSystem.Infrastructure.Attributes;

namespace StudentCareSystem.API.Controllers;

public class StudentCareAssignmentsController(
    IStudentCareAssignmentService studentCareAssignmentService
) : BaseController
{
    /// <summary>
    /// Add a new student care assignment.
    /// </summary>
    /// <param name="request">The data for the new student care assignment.</param>
    /// <returns>The created student care assignment.</returns>
    [HttpPost]
    [RequiredPermission(PermissionType.WriteStudentCareAssignment)]
    public async Task<IActionResult> Add(ApiRequest<CreateStudentCareAssignmentDto> request)
    {
        var result = await studentCareAssignmentService.AddAsync(request.Data);
        return Ok(new ApiResponse<GetStudentCareAssignmentDto>(
            201,
            MessageDescription.ApiResponseMessageDescription.Created,
            result));
    }

    /// <summary>
    /// Update an existing student care assignment.
    /// </summary>
    /// <param name="request">The updated student care assignment data.</param>
    /// <returns>A response indicating the success of the operation.</returns>
    [HttpPut]
    [RequiredPermission(PermissionType.WriteStudentCareAssignment)]
    public async Task<IActionResult> Update(ApiRequest<UpdateStudentCareAssignmentDto> request)
    {
        await studentCareAssignmentService.UpdateAsync(request.Data);
        return Ok(new ApiResponse<object>(
            200,
            MessageDescription.ApiResponseMessageDescription.Updated,
            null));
    }

    /// <summary>
    /// Automatically assign student need care to users.
    /// </summary>
    /// <returns>A response indicating the success of the operation.</returns>
    [HttpPost("auto-assign")]
    [RequiredPermission(PermissionType.WriteStudentCareAssignment)]
    public async Task<IActionResult> AutoAssign()
    {
        await studentCareAssignmentService.AutoAssignStudentNeedCareToUserAsync();
        return Ok(new ApiResponse<object>(
            200,
            "Students have been automatically assigned successfully",
            null));
    }


    /// <summary>
    /// Automatically assign student need care to users with specified percentages.
    /// </summary>
    /// <param name="request">The user percentage map for auto assignment.</param>
    /// <returns>A response indicating the success of the operation.</returns>
    [HttpPost("auto-assign-with-percentage")]
    [RequiredPermission(PermissionType.WriteStudentCareAssignment)]
    public async Task<IActionResult> AutoAssignWithPercentage(ApiRequest<AutoAssignDto> request)
    {
        await studentCareAssignmentService.AutoAssignStudentNeedCareToUserAsync(request.Data.UserPercentages);
        return Ok(new ApiResponse<object>(
            200,
            "Students have been automatically assigned successfully",
            null));
    }

    /// <summary>
    /// Get count of student care assignments by semester.
    /// </summary>
    /// <param name="semesterName">The name of the semester.</param>
    /// <returns>Count of student care assignments grouped by user for the specified semester.</returns>
    [HttpGet("user-assigned-count")]
    [RequiredPermission(PermissionType.ReadStudentCareAssignment)]
    public async Task<IActionResult> GetCountBySemester([FromQuery] string semesterName)
    {
        var result = await studentCareAssignmentService.GetAssignmentCountByUserBySemesternameAsync(semesterName);
        return Ok(new ApiResponse<IEnumerable<GetCountStudentCareDto>>(
            200,
            MessageDescription.ApiResponseMessageDescription.Success,
            result));
    }
}
