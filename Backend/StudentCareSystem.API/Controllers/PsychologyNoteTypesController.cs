using Microsoft.AspNetCore.Mvc;

using StudentCareSystem.Application.Commons.Interfaces;
using StudentCareSystem.Application.Commons.Models.Apis;
using StudentCareSystem.Application.Commons.Models.PsychologyNoteTypes;
using StudentCareSystem.Domain.Constants;
using StudentCareSystem.Domain.Enums;
using StudentCareSystem.Infrastructure.Attributes;

namespace StudentCareSystem.API.Controllers;

public class PsychologyNoteTypesController(
    IPsychologyNoteTypeService psychologyNoteTypeService
) : BaseController
{
    /// <summary>
    /// Get all psychology note types.
    /// </summary>
    /// <returns>A list of psychology note types.</returns>
    [HttpGet]
    [RequiredPermission(PermissionType.ReadNoteType)]
    public async Task<IActionResult> GetAll()
    {
        var noteTypes = await psychologyNoteTypeService.GetAllAsync();
        return Ok(new ApiResponse<IEnumerable<GetPsychologyNoteTypeDto>>(
            200,
            MessageDescription.ApiResponseMessageDescription.Success,
            noteTypes));
    }

    /// <summary>
    /// Get a psychology note type by ID.
    /// </summary>
    /// <param name="id">The ID of the psychology note type.</param>
    /// <returns>The psychology note type with the specified ID.</returns>
    [HttpGet("{id}")]
    [RequiredPermission(PermissionType.ReadNoteType)]
    public async Task<IActionResult> GetById(Guid id)
    {
        var noteType = await psychologyNoteTypeService.GetByIdAsync(id);
        return Ok(new ApiResponse<GetPsychologyNoteTypeDto>(
            200,
            MessageDescription.ApiResponseMessageDescription.Success,
            noteType));
    }

    /// <summary>
    /// Add a new psychology note type.
    /// </summary>
    /// <param name="createPsychologyNoteTypeDto">The data for the new psychology note type.</param>
    /// <returns>The created psychology note type.</returns>
    [HttpPost]
    [RequiredPermission(PermissionType.WriteNoteType)]
    public async Task<IActionResult> Add(ApiRequest<CreatePsychologyNoteTypeDto> createPsychologyNoteTypeDto)
    {
        var noteType = await psychologyNoteTypeService.AddAsync(createPsychologyNoteTypeDto.Data);
        return CreatedAtAction(nameof(GetById), new { id = noteType.Id },
            new ApiResponse<GetPsychologyNoteTypeDto>(
                201,
                MessageDescription.ApiResponseMessageDescription.Created,
                noteType));
    }

    /// <summary>
    /// Update an existing psychology note type.
    /// </summary>
    /// <param name="updatePsychologyNoteTypeDto">The data for updating the psychology note type.</param>
    /// <param name="id">The ID of the psychology note type to update.</param>
    /// <returns>No content.</returns>
    [HttpPut("{id}")]
    [RequiredPermission(PermissionType.WriteNoteType)]
    public async Task<IActionResult> Update(ApiRequest<UpdatePsychologyNoteTypeDto> updatePsychologyNoteTypeDto, Guid id)
    {
        if (updatePsychologyNoteTypeDto.Data.Id != id)
        {
            return BadRequest(new ApiResponse<GetPsychologyNoteTypeDto>(
                400,
                MessageDescription.ApiResponseMessageDescription.IdMismatch,
                null));
        }
        await psychologyNoteTypeService.UpdateAsync(updatePsychologyNoteTypeDto.Data);
        return Ok(new ApiResponse<GetPsychologyNoteTypeDto>(
            200,
            MessageDescription.ApiResponseMessageDescription.Updated,
            null));
    }

    /// <summary>
    /// Delete a psychology note type by ID.
    /// </summary>
    /// <param name="id">The ID of the psychology note type to delete.</param>
    /// <returns>No content.</returns>
    [HttpDelete("{id}")]
    [RequiredPermission(PermissionType.WriteNoteType)]
    public async Task<IActionResult> Delete(Guid id)
    {
        await psychologyNoteTypeService.DeleteAsync(id);
        return Ok(new ApiResponse<GetPsychologyNoteTypeDto>(
            200,
            MessageDescription.ApiResponseMessageDescription.Deleted,
            null));
    }
}
