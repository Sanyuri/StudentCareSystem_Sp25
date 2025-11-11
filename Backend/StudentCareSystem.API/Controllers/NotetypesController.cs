using Microsoft.AspNetCore.Mvc;

using StudentCareSystem.Application.Commons.Interfaces;
using StudentCareSystem.Application.Commons.Models.Apis;
using StudentCareSystem.Application.Commons.Models.NoteTypes;
using StudentCareSystem.Domain.Constants;
using StudentCareSystem.Domain.Enums;
using StudentCareSystem.Infrastructure.Attributes;

namespace StudentCareSystem.API.Controllers;

public class NoteTypesController(INoteTypeService noteTypeService) : BaseController
{

    /// <summary>
    /// Get all note types.
    /// </summary>
    /// <returns>A list of note types.</returns>
    [HttpGet]
    [RequiredPermission(PermissionType.ReadNoteType)]
    public async Task<IActionResult> GetAll()
    {
        var noteTypes = await noteTypeService.GetAllAsync();
        return Ok(new ApiResponse<IEnumerable<GetNoteTypeDto>>(200, "Note types retrieved successfully", noteTypes));
    }

    /// <summary>
    /// Get a note type by ID.
    /// </summary>
    /// <param name="id">The ID of the note type.</param>
    /// <returns>The note type with the specified ID.</returns>
    [HttpGet("{id}")]
    [RequiredPermission(PermissionType.ReadNoteType)]
    public async Task<IActionResult> GetById(Guid id)
    {
        var noteType = await noteTypeService.GetByIdAsync(id);
        return Ok(new ApiResponse<GetNoteTypeDto>(
            200,
            MessageDescription.ApiResponseMessageDescription.Success,
            noteType));
    }

    /// <summary>
    /// Get a note type by default type.
    /// </summary>
    /// <param name="defaultNoteType">The default note type.</param>
    /// <returns>The note type with the specified default type.</returns>
    [HttpGet("default/{defaultNoteType}")]
    [RequiredPermission(PermissionType.ReadNoteType)]
    public async Task<IActionResult> GetByDefaultType(DefaultNoteType defaultNoteType)
    {
        var noteType = await noteTypeService.GetByDefaultTypeAsync(defaultNoteType);
        return Ok(new ApiResponse<GetNoteTypeDto>(
            200,
            MessageDescription.ApiResponseMessageDescription.Success,
            noteType));
    }

    /// <summary>
    /// Add a new note type.
    /// </summary>
    /// <param name="createNoteTypeDto">The data for the new note type.</param>
    /// <returns>The created note type.</returns>
    [HttpPost]
    [RequiredPermission(PermissionType.WriteNoteType)]
    public async Task<IActionResult> Add(ApiRequest<CreateNoteTypeDto> createNoteTypeDto)
    {
        var noteType = await noteTypeService.AddAsync(createNoteTypeDto.Data);
        return CreatedAtAction(nameof(GetById), new { id = noteType.Id },
            new ApiResponse<GetNoteTypeDto>(
                201,
                MessageDescription.ApiResponseMessageDescription.Created,
                noteType));
    }

    /// <summary>
    /// Update an existing note type.
    /// </summary>
    /// <param name="updateNoteTypeDto">The data for updating the note type.</param>
    /// <returns>No content.</returns>
    [HttpPut("{id}")]
    [RequiredPermission(PermissionType.WriteNoteType)]
    public async Task<IActionResult> Update(ApiRequest<UpdateNoteTypeDto> updateNoteTypeDto, Guid id)
    {
        if (updateNoteTypeDto.Data.Id != id)
        {
            return BadRequest(new ApiResponse<GetNoteTypeDto>(
                400,
                MessageDescription.ApiResponseMessageDescription.IdMismatch,
                null));
        }
        await noteTypeService.UpdateAsync(updateNoteTypeDto.Data);
        return Ok(new ApiResponse<GetNoteTypeDto>(
            200,
            MessageDescription.ApiResponseMessageDescription.Updated,
            null));
    }

    /// <summary>
    /// Delete a note type by ID.
    /// </summary>
    /// <param name="id">The ID of the note type to delete.</param>
    /// <returns>No content.</returns>
    [HttpDelete("{id}")]
    [RequiredPermission(PermissionType.WriteNoteType)]
    public async Task<IActionResult> Delete(Guid id)
    {
        await noteTypeService.DeleteAsync(id);
        return Ok(new ApiResponse<GetNoteTypeDto>(
            200,
            MessageDescription.ApiResponseMessageDescription.Deleted,
            null));
    }
}
