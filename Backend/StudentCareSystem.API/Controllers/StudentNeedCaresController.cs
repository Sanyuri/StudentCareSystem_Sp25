using Microsoft.AspNetCore.Mvc;

using StudentCareSystem.Application.Commons.Interfaces;
using StudentCareSystem.Application.Commons.Interfaces.Jobs;
using StudentCareSystem.Application.Commons.Models.Apis;
using StudentCareSystem.Application.Commons.Models.StudentNeedCares;
using StudentCareSystem.Domain.Constants;
using StudentCareSystem.Domain.Enums;
using StudentCareSystem.Domain.Helpers;
using StudentCareSystem.Infrastructure.Attributes;


namespace StudentCareSystem.API.Controllers;

public class StudentNeedCaresController(
    IJobService jobService,
    IStudentNeedCareService studentNeedCareService
) : BaseController
{
    /// <summary>
    /// Get all student need cares with pagination.
    /// </summary>
    /// <param name="filter">The filter for student need cares.</param>
    /// <returns>A paginated list of student need cares.</returns>
    [HttpGet]
    [RequiredPermission(PermissionType.ReadStudentCare)]
    public async Task<IActionResult> GetAll([FromQuery] StudentNeedCareFilter filter)
    {
        var studentNeedCares = await studentNeedCareService.GetAllWithPaginationAsync(filter);
        return Ok(new ApiResponse<Pagination<GetStudentNeedCareDto>>(
            200,
            MessageDescription.ApiResponseMessageDescription.Success,
            studentNeedCares));
    }

    /// <summary>
    /// Get a student need care by its ID.
    /// </summary>
    /// <param name="id">The ID of the student need care to retrieve.</param>
    /// <returns>The student need care corresponding to the given ID.</returns>
    [HttpGet("{id}")]
    [RequiredPermission(PermissionType.ReadStudentCare)]
    public async Task<IActionResult> GetById(Guid id)
    {
        var studentNeedCare = await studentNeedCareService.GetByIdAsync(id);
        return Ok(new ApiResponse<GetStudentNeedCareDto>(
            200,
            MessageDescription.ApiResponseMessageDescription.Success,
            studentNeedCare));
    }

    /// <summary>
    /// Add a new student need care.
    /// </summary>
    /// <param name="createStudentNeedCareDto">The data for the new student need care.</param>
    /// <returns>The created student need care.</returns>
    [HttpPost]
    [RequiredPermission(PermissionType.WriteStudentCare)]
    public async Task<IActionResult> Add(ApiRequest<CreateStudentNeedCareDto> createStudentNeedCareDto)
    {
        var studentNeedCare = await studentNeedCareService.AddAsync(createStudentNeedCareDto.Data);
        return CreatedAtAction(nameof(GetById),
            new { id = studentNeedCare.Id },
            new ApiResponse<GetStudentNeedCareDto>(
                201,
                MessageDescription.ApiResponseMessageDescription.Created,
                studentNeedCare));
    }

    /// <summary>
    /// Update an existing student need care.
    /// </summary>
    /// <param name="id">The ID of the student need care to update.</param>
    /// <param name="request">The updated student need care data.</param>
    /// <returns>A response indicating the success of the operation.</returns>
    [HttpPut("{id}")]
    [RequiredPermission(PermissionType.WriteStudentCare)]
    public async Task<IActionResult> Update(Guid id, ApiRequest<UpdateStudentNeedCareDto> request)
    {
        if (id != request.Data.Id)
        {
            return BadRequest(new ApiResponse<GetStudentNeedCareDto>(
                400,
                MessageDescription.ApiResponseMessageDescription.IdMismatch,
                null));
        }

        await studentNeedCareService.UpdateAsync(request.Data);
        return Ok(new ApiResponse<object>(
            200,
            MessageDescription.ApiResponseMessageDescription.Updated,
            null));
    }

    /// <summary>
    /// Delete a student need care by its ID.
    /// </summary>
    /// <param name="id">The ID of the student need care to delete.</param>
    /// <returns>A response indicating the success of the operation.</returns>
    [HttpDelete("{id}")]
    [RequiredPermission(PermissionType.WriteStudentCare)]
    public async Task<IActionResult> Delete(Guid id)
    {
        await studentNeedCareService.DeleteAsync(id);
        return Ok(new ApiResponse<object>(
            200,
            MessageDescription.ApiResponseMessageDescription.Deleted,
            null));
    }

    /// <summary>
    /// Scan for students that need care.
    /// </summary>
    /// <param name="request">The request containing the number of students to scan.</param>
    /// <returns>A response indicating the success of the operation.</returns>
    [HttpPost("scan")]
    [RequiredPermission(PermissionType.ScanData)]
    public async Task<IActionResult> ScanStudentNeedCare(ApiRequest<StudentNeedCareScanRequest> request)
    {
        await studentNeedCareService.ScanStudentNeedCareAsync(request.Data.NumberOfStudentNeedCare);
        return Ok(new ApiResponse<object>(
            200,
            "Scan completed successfully",
            null));
    }

    [HttpGet("care-status-count")]
    [RequiredPermission(PermissionType.ReadStudentCare)]
    public async Task<IActionResult> GetCareStatusCountBySemester([FromQuery] string semesterName)
    {
        var result = await studentNeedCareService.GetCareStatusCountBySemesterAsync(semesterName);
        return Ok(new ApiResponse<IEnumerable<Dictionary<CareStatus, int>>>(
            200,
            MessageDescription.ApiResponseMessageDescription.Success,
            result));
    }

    [HttpGet("scanned-list")]
    [RequiredPermission(PermissionType.ReadStudentCare)]
    public async Task<IActionResult> GetScannedList([FromQuery] StudentNeedCareFilter filter)
    {
        var scannedList = await studentNeedCareService.GetScannedListAsync(filter);
        return Ok(new ApiResponse<Pagination<GetStudentNeedCareDto>>(
            200,
            MessageDescription.ApiResponseMessageDescription.Success,
            scannedList));
    }

    [HttpDelete("scanned-list/{studentCodes}")]
    [RequiredPermission(PermissionType.WriteStudentCare)]
    public async Task<IActionResult> DeleteFromScannedList(string studentCodes)
    {
        await studentNeedCareService.DeleteFromScannedListAsync(studentCodes);
        return Ok(new ApiResponse<object>(
            200,
            MessageDescription.ApiResponseMessageDescription.Deleted,
            null));
    }

    [HttpPost("confirm")]
    [RequiredPermission(PermissionType.WriteStudentCare)]
    public async Task<IActionResult> ConfirmScannedList()
    {
        await studentNeedCareService.ConfirmScannedListAsync();
        return Ok(new ApiResponse<object>(
            200,
            MessageDescription.ApiResponseMessageDescription.Updated,
            null));
    }

    // add a new endpoint to change the care status of a student need care
    [HttpPut("change-care-status/{id}")]
    [RequiredPermission(PermissionType.WriteStudentCare)]
    public async Task<IActionResult> ChangeCareStatus(Guid id, ApiRequest<ChangeCareStatusDto> request)
    {
        if (id != request.Data.Id)
        {
            return BadRequest(new ApiResponse<GetStudentNeedCareDto>(
                400,
                MessageDescription.ApiResponseMessageDescription.IdMismatch,
                null));
        }

        await studentNeedCareService.ChangeStatusAsync(request.Data);
        return Ok(new ApiResponse<object>(
            200,
            MessageDescription.ApiResponseMessageDescription.Updated,
            null));
    }

    /// <summary>
    /// Perform final evaluation of student care.
    /// </summary>
    /// <param name="request">The final evaluation data.</param>
    /// <returns>A response indicating the success of the operation.</returns>
    [HttpPut("final-evaluate/{id}")]
    [RequiredPermission(PermissionType.WriteStudentCare)]
    public async Task<IActionResult> FinalEvaluate(ApiRequest<FinalEvaluateStudentCareDto> request, Guid id)
    {
        if (id != request.Data.Id)
        {
            return BadRequest(new ApiResponse<GetStudentNeedCareDto>(
                400,
                MessageDescription.ApiResponseMessageDescription.IdMismatch,
                null));
        }

        // Call the service to perform the final evaluation of student care
        await studentNeedCareService.FinalEvaluateStudentCareAsync(request.Data);
        return Ok(new ApiResponse<object>(
            200,
            MessageDescription.ApiResponseMessageDescription.Updated,
            null));
    }

    // Endpoint for analyzing student need care data
    [HttpPost("analyze")]
    [ProducesResponseType(typeof(ApiResponse<string>), 200)]
    [RequiredPermission(PermissionType.ScanData)]
    public IActionResult AnalyzeStudentNeedCare(ApiRequest<StudentNeedCareAnalyzeRequest> request)
    {
        jobService.ExecuteStudentNeedCareAnalyzeManually(request.Data);
        return Ok(new ApiResponse<object>(
            200,
            MessageDescription.ApiResponseMessageDescription.Success,
            null));
    }

}
