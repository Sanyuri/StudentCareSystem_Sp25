using Microsoft.AspNetCore.Mvc;

using StudentCareSystem.Application.Commons.Interfaces;
using StudentCareSystem.Application.Commons.Models.Apis;
using StudentCareSystem.Application.Commons.Models.Applications;
using StudentCareSystem.Domain.Constants;
using StudentCareSystem.Domain.Enums;
using StudentCareSystem.Domain.Helpers;
using StudentCareSystem.Infrastructure.Attributes;

namespace StudentCareSystem.API.Controllers;

public class StudentApplicationsController(IStudentApplicationService studentApplicationService) : BaseController
{
    private readonly IStudentApplicationService _studentApplicationService = studentApplicationService;


    /// <summary>
    /// Retrieves all student applications based on the provided filter.
    /// </summary>
    /// <param name="filter">The filter criteria to apply for retrieving student applications.</param>
    /// <returns>A list of student applications matching the filter, along with pagination details.</returns>
    [HttpGet]
    [RequiredPermission(PermissionType.ReadStudentApplication)]
    public async Task<IActionResult> GetAll([FromQuery] StudentApplicationFilter filter)
    {
        var applications = await _studentApplicationService.GetAllWithPaginationAsync(filter);
        return Ok(new ApiResponse<Pagination<GetStudentApplicationDto>>(
            200,
            MessageDescription.ApiResponseMessageDescription.Success,
            applications));
    }

    /// <summary>
    /// Retrieves a specific student application by its ID.
    /// </summary>
    /// <param name="id">The ID of the student application to retrieve.</param>
    /// <returns>The student application with the specified ID, or a 404 status if not found.</returns>
    [HttpGet("{id}")]
    [RequiredPermission(PermissionType.ReadStudentApplication)]
    public async Task<IActionResult> GetById(Guid id)
    {
        var application = await _studentApplicationService.GetByIdAsync(id);
        return Ok(new ApiResponse<GetStudentApplicationDto>(
            200,
            MessageDescription.ApiResponseMessageDescription.Success,
            application));
    }

    /// <summary>
    /// Creates a new student application.
    /// </summary>
    /// <param name="createApplicationDto">The data for the new student application to create.</param>
    /// <returns>A confirmation message indicating that the student application was created successfully.</returns>
    [HttpPost]
    [RequiredPermission(PermissionType.WriteStudentApplication)]
    public async Task<IActionResult> AddStudentApplication([FromBody] ApiRequest<CreateStudentApplicationDto> createApplicationDto)
    {
        var result = await _studentApplicationService.AddAsync(createApplicationDto.Data);
        return CreatedAtAction(nameof(GetById), new { id = result.Id },
            new ApiResponse<GetStudentApplicationDto>(
                201,
                MessageDescription.ApiResponseMessageDescription.Created,
                result));
    }


    /// <summary>
    /// Deletes a student application by its ID.
    /// </summary>
    /// <param name="id">The ID of the student application to delete.</param>
    /// <returns>A 204 status code if deletion was successful, or a 404 status code if the application was not found.</returns>
    [HttpDelete("{id}")]
    [RequiredPermission(PermissionType.WriteStudentApplication)]
    public async Task<IActionResult> Delete(Guid id)
    {
        await _studentApplicationService.DeleteAsync(id);
        return NoContent();
    }
}
