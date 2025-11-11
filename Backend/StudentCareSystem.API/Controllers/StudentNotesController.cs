using Microsoft.AspNetCore.Mvc;

using StudentCareSystem.Application.Commons.Interfaces;
using StudentCareSystem.Application.Commons.Models.Apis;
using StudentCareSystem.Application.Commons.Models.Notes;
using StudentCareSystem.Domain.Constants;
using StudentCareSystem.Domain.Enums;
using StudentCareSystem.Domain.Helpers;
using StudentCareSystem.Infrastructure.Attributes;

namespace StudentCareSystem.API.Controllers;

public class StudentNotesController(
    IStudentNoteService studentNoteService
) : BaseController
{

    /// <summary>
    /// Get all student notes with optional filtering.
    /// </summary>
    /// <param name="filter">The filter criteria for student notes.</param>
    /// <returns>A paginated list of student notes.</returns>
    [HttpGet]
    [RequiredPermission(PermissionType.ReadStudentNote)]
    public async Task<IActionResult> GetAll([FromQuery] StudentNoteFilter filter)
    {
        var notes = await studentNoteService.GetAllWithPaginationAsync(filter);
        return Ok(new ApiResponse<Pagination<GetStudentNoteDto>>(
            200,
            MessageDescription.ApiResponseMessageDescription.Success,
            notes));
    }

    /// <summary>
    /// Get student notes by entity ID.
    /// </summary>
    /// <param name="entityId">The entity ID to get associated student notes.</param>
    /// <returns>A list of student notes related to the entity.</returns>
    [HttpGet("entity/{entityId}")]
    [RequiredPermission(PermissionType.ReadStudentNote)]
    public async Task<IActionResult> GetByEntityId(Guid entityId)
    {
        var notes = await studentNoteService.GetByEntityIdAsync(entityId);
        return Ok(new ApiResponse<IEnumerable<GetStudentNoteDto>>(
            200,
            MessageDescription.ApiResponseMessageDescription.Success,
            notes));
    }

    /// <summary>
    /// Get student notes by student code.
    /// </summary>
    /// <param name="studentCode">The student code to retrieve student notes for.</param>
    /// <returns>A list of student notes for the specified student code.</returns>
    [HttpGet("student/{studentCode}")]
    [RequiredPermission(PermissionType.ReadStudentNote)]
    public async Task<IActionResult> GetByStudentCode(string studentCode)
    {
        var notes = await studentNoteService.GetByStudentCodeAsync(studentCode);
        return Ok(new ApiResponse<IEnumerable<GetStudentNoteDto>>(
            200,
            MessageDescription.ApiResponseMessageDescription.Success,
            notes));
    }

    /// <summary>
    /// Get a student note by its ID.
    /// </summary>
    /// <param name="id">The ID of the student note to retrieve.</param>
    /// <returns>The student note corresponding to the given ID.</returns>
    [HttpGet("{id}")]
    [RequiredPermission(PermissionType.ReadStudentNote)]
    public async Task<IActionResult> GetById(Guid id)
    {
        var note = await studentNoteService.GetByIdAsync(id);
        return Ok(new ApiResponse<GetStudentNoteDto>(
            200,
            MessageDescription.ApiResponseMessageDescription.Success,
            note));
    }

    /// <summary>
    /// Add a new student note.
    /// </summary>
    /// <param name="createStudentNoteDto">The data to create a new student note.</param>
    /// <returns>The created student note.</returns>
    [HttpPost]
    [RequiredPermission(PermissionType.WriteStudentNote)]
    public async Task<IActionResult> Add(ApiRequest<CreateStudentNoteDto> createStudentNoteDto)
    {
        var note = await studentNoteService.AddAsync(createStudentNoteDto.Data);
        return CreatedAtAction(nameof(GetById), new { id = note.Id },
            new ApiResponse<GetStudentNoteDto>(
                201,
                MessageDescription.ApiResponseMessageDescription.Created, note));
    }

    /// <summary>
    /// Import student notes in bulk.
    /// </summary>
    /// <param name="importStudentNoteDto">The data to import student notes.</param>
    /// <returns>The imported student notes.</returns>
    [HttpPost("import")]
    [RequiredPermission(PermissionType.WriteStudentNote)]
    public async Task<IActionResult> Import(ApiRequest<IEnumerable<ImportStudentNoteDto>> importStudentNoteDto)
    {
        var notes = await studentNoteService.ImportAsync(importStudentNoteDto.Data);
        return CreatedAtAction(nameof(GetById), new { id = notes.First().Id },
            new ApiResponse<IEnumerable<GetStudentNoteDto>>(
                201,
                MessageDescription.ApiResponseMessageDescription.Created,
                notes));
    }

    /// <summary>
    /// Update an existing student note.
    /// </summary>
    /// <param name="updateStudentNoteDto">The data for updating the student note.</param>
    /// <returns>No content.</returns>
    [HttpPut("{id}")]
    [RequiredPermission(PermissionType.WriteStudentNote)]
    public async Task<IActionResult> Update(ApiRequest<UpdateStudentNoteDto> updateStudentNoteDto, Guid id)
    {
        if (updateStudentNoteDto.Data.Id != id)
        {
            return BadRequest(new ApiResponse<GetStudentNoteDto>(
                400,
                MessageDescription.ApiResponseMessageDescription.IdMismatch,
                null));
        }
        await studentNoteService.UpdateAsync(updateStudentNoteDto.Data);
        return Ok(new ApiResponse<GetStudentNoteDto>(
            200,
            MessageDescription.ApiResponseMessageDescription.Updated,
            null));
    }

    /// <summary>
    /// Delete a student note by ID.
    /// </summary>
    /// <param name="id">The ID of the student note to delete.</param>
    /// <returns>No content.</returns>
    [HttpDelete("{id}")]
    [RequiredPermission(PermissionType.WriteStudentNote)]
    public async Task<IActionResult> Delete(Guid id)
    {
        await studentNoteService.DeleteAsync(id);
        return Ok(new ApiResponse<GetStudentNoteDto>(
            200,
            MessageDescription.ApiResponseMessageDescription.Deleted,
            null));
    }
}
