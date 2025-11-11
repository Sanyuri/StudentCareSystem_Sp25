using Application.Commons.Models.StudentPsychology;

using Microsoft.AspNetCore.Mvc;

using StudentCareSystem.Application.Commons.Interfaces;
using StudentCareSystem.Application.Commons.Models.Apis;
using StudentCareSystem.Application.Commons.Models.StudentPsychologies;
using StudentCareSystem.Domain.Constants;
using StudentCareSystem.Domain.Enums;
using StudentCareSystem.Domain.Helpers;
using StudentCareSystem.Infrastructure.Attributes;

namespace StudentCareSystem.API.Controllers;

public class StudentPsychologiesController(
    IStudentPsychologyService studentPsychologyService
) : BaseController
{
    /// <summary>
    /// Get all student psychologies.
    /// </summary>
    /// <param name="filter">The filter for student psychologies.</param>
    /// <returns>A list of student psychologies.</returns>
    [HttpGet]
    [RequiredPermission(PermissionType.ReadStudentPsychology)]
    public async Task<IActionResult> GetAll([FromQuery] StudentPsychologyFilter filter)
    {
        var studentPsychologies = await studentPsychologyService.GetAllAsync(filter);
        return Ok(new ApiResponse<Pagination<GetStudentPsychologyDto>>(
            200,
            MessageDescription.ApiResponseMessageDescription.Success,
            studentPsychologies));
    }

    /// <summary>
    /// Get a student psychology by its ID.
    /// </summary>
    /// <param name="id">The ID of the student psychology to retrieve.</param>
    /// <returns>The student psychology corresponding to the given ID.</returns>
    [HttpGet("{id}")]
    [RequiredPermission(PermissionType.ReadStudentPsychology)]
    public async Task<IActionResult> GetById(Guid id)
    {
        var studentPsychology = await studentPsychologyService.GetByIdAsync(id);
        return Ok(new ApiResponse<GetStudentPsychologyDto>(
            200,
            MessageDescription.ApiResponseMessageDescription.Success,
            studentPsychology));
    }

    /// <summary>
    /// Get a student psychology by student code.
    /// </summary>
    /// <param name="studentCode">The student code to retrieve student psychology for.</param>
    /// <returns>The student psychology for the specified student code.</returns>
    [HttpGet("student-code/{studentCode}")]
    [RequiredPermission(PermissionType.ReadStudentPsychology)]
    public async Task<IActionResult> GetByStudentCode(string studentCode)
    {
        var studentPsychology = await studentPsychologyService.GetByStudentCodeAsync(studentCode);
        return Ok(new ApiResponse<GetStudentPsychologyDto>(
            200,
            MessageDescription.ApiResponseMessageDescription.Success,
            studentPsychology));
    }

    /// <summary>
    /// Add a new student psychology.
    /// </summary>
    /// <param name="createStudentPsychologyDto">The data for the new student psychology.</param>
    /// <returns>The created student psychology.</returns>
    [HttpPost]
    [RequiredPermission(PermissionType.WriteStudentPsychology)]
    public async Task<IActionResult> Add(ApiRequest<CreateStudentPsychologyDto> createStudentPsychologyDto)
    {
        var studentPsychology = await studentPsychologyService.AddAsync(createStudentPsychologyDto.Data);
        return CreatedAtAction(nameof(GetById),
            new { id = studentPsychology.Id },
            new ApiResponse<GetStudentPsychologyDto>(
                201,
                MessageDescription.ApiResponseMessageDescription.Created,
                studentPsychology));
    }

    /// <summary>
    /// Verify the student psychology.
    /// </summary>
    /// <param name="request"></param>
    /// <returns></returns>
    [HttpPost("verify-psychology")]
    [RequiredPermission(PermissionType.WriteStudentPsychology)]
    public async Task<IActionResult> VerifyPsychology([FromBody] ApiRequest<VerifyPsychologyRequest> request)
    {
        var result = await studentPsychologyService.VerifyPsychologyAsync(request.Data);
        return Ok(new ApiResponse<VerifyPsychologyResponse>(200, "Verify success", result));
    }

    /// <summary>
    /// Update password for existing student psychology .
    /// </summary>
    /// <param name="id"></param>
    /// <param name="request"></param>
    /// <returns></returns>
    [HttpPut("change-password/{id}")]
    [RequiredPermission(PermissionType.WriteStudentPsychology)]
    public async Task<IActionResult> UpdatePsychologyPasswordDto(Guid id,
        ApiRequest<UpdateStudentPsychologyPasswordRequest> request)
    {
        if (id != request.Data.Id)
        {
            return BadRequest(new ApiResponse<GetStudentPsychologyDto>(
                400,
                MessageDescription.ApiResponseMessageDescription.IdMismatch,
                null));
        }

        await studentPsychologyService.UpdatePasswordAsync(request.Data);
        return Ok(new ApiResponse<object>(
            200,
            MessageDescription.ApiResponseMessageDescription.Updated,
            null));
    }

    /// <summary>
    /// Forget password for existing student psychology .
    /// </summary>
    /// <param name="request"></param>
    /// <returns></returns>
    [HttpPut("forget-password/{id}")]
    [RequiredPermission(PermissionType.WriteStudentPsychology)]
    public async Task<IActionResult> ForgetPassword(Guid id, ApiRequest<ForgetPasswordRequest> request)
    {
        if (id != request.Data.Id)
        {
            return BadRequest(new ApiResponse<object>(
                400,
                MessageDescription.ApiResponseMessageDescription.IdMismatch,
                null));
        }

        await studentPsychologyService.ForgetPasswordAsync(request.Data);
        return Ok(new ApiResponse<object>(
            200,
            MessageDescription.ApiResponseMessageDescription.Updated,
            null));
    }

    /// <summary>
    /// Delete an existing student psychology record.
    /// </summary>
    /// <param name="id">The ID of the student psychology to delete.</param>
    /// <param name="request">The delete request data.</param>
    /// <returns>A success response if deletion is successful.</returns>
    [HttpDelete("{id}")]
    [RequiredPermission(PermissionType.WriteStudentPsychology)]
    public async Task<IActionResult> Delete(Guid id, ApiRequest<DeleteStudentPsychologyDto> request)
    {
        if (id != request.Data.Id)
        {
            return BadRequest(new ApiResponse<object>(
                400,
                MessageDescription.ApiResponseMessageDescription.IdMismatch,
                null));
        }

        await studentPsychologyService.DeleteAsync(request.Data);
        return Ok(new ApiResponse<object>(
            200,
            MessageDescription.ApiResponseMessageDescription.Deleted,
            null));
    }
}
