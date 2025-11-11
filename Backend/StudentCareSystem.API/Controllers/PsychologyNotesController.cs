using Microsoft.AspNetCore.Mvc;

using StudentCareSystem.Application.Commons.Interfaces;
using StudentCareSystem.Application.Commons.Models.Apis;
using StudentCareSystem.Application.Commons.Models.PsychologyNotes;
using StudentCareSystem.Domain.Constants;
using StudentCareSystem.Domain.Enums;
using StudentCareSystem.Infrastructure.Attributes;

namespace StudentCareSystem.API.Controllers;

public class PsychologyNotesController(IPsychologyNoteService psychologyNoteService) : BaseController
{
    /// <summary>
    /// Add a new psychology note.
    /// </summary>
    /// <param name="createPsychologyNoteDto">The data for the new psychology note.</param>
    /// <returns>The created psychology note.</returns>
    [HttpPost]
    [StudentPsychology]
    [RequiredPermission(PermissionType.WritePsychologicalNote)]
    public async Task<IActionResult> Add(ApiRequest<CreatePsychologyNoteDto> createPsychologyNoteDto)
    {
        var psychologyNote = await psychologyNoteService.AddAsync(createPsychologyNoteDto.Data);
        return CreatedAtAction(nameof(GetByStudentPsychologyId), new { studentPsychologyId = psychologyNote.StudentPsychologyId },
            new ApiResponse<GetPsychologyNoteDto>(
                201,
                MessageDescription.ApiResponseMessageDescription.Created,
                psychologyNote));
    }

    /// <summary>
    /// Get psychology notes by student psychology ID.
    /// </summary>
    /// <param name="studentPsychologyId">The ID of the student psychology.</param>
    /// <returns>A list of psychology notes for the specified student psychology ID.</returns>
    [HttpGet("student/{studentPsychologyId}")]
    [StudentPsychology]
    [RequiredPermission(PermissionType.ReadPsychologicalNote)]
    public async Task<IActionResult> GetByStudentPsychologyId(Guid studentPsychologyId)
    {
        var psychologyNotes = await psychologyNoteService.GetByStudentPsychologyIdAsync(studentPsychologyId);
        return Ok(new ApiResponse<IEnumerable<GetPsychologyNoteDto>>(
            200,
            MessageDescription.ApiResponseMessageDescription.Success,
            psychologyNotes));
    }

    /// <summary>
    /// Updates an existing psychology note.
    /// </summary>
    /// <param name="updatePsychologyNoteDto">The data for updating the psychology note.</param>
    /// <param name="id">The ID of the psychology note to update.</param>
    /// <returns>A status indicating success or the reason for failure.</returns>
    [HttpPut("{id}")]
    [StudentPsychology]
    [RequiredPermission(PermissionType.WritePsychologicalNote)]
    public async Task<IActionResult> Update(ApiRequest<UpdatePsychologyNoteDto> updatePsychologyNoteDto, Guid id)
    {
        if (updatePsychologyNoteDto.Data.Id != id)
        {
            return BadRequest(new ApiResponse<GetPsychologyNoteDto>(
                400,
                MessageDescription.ApiResponseMessageDescription.IdMismatch,
                null));
        }
        await psychologyNoteService.UpdateAsync(updatePsychologyNoteDto.Data);
        return Ok(new ApiResponse<GetPsychologyNoteDto>(
            200,
            MessageDescription.ApiResponseMessageDescription.Updated,
            null));
    }

    /// <summary>
    /// Updates the drive URL for a psychology note.
    /// </summary>
    /// <param name="id">The ID of the psychology note.</param>
    /// <param name="request">The request containing the drive URL.</param>
    /// <returns>A status indicating success or the reason for failure.</returns>
    [HttpPut("{id}/drive-url")]
    [StudentPsychology]
    [RequiredPermission(PermissionType.WritePsychologicalNote)]
    public async Task<IActionResult> UpdateDriveUrl(Guid id, ApiRequest<UpdateDriveUrlDto> request)
    {
        if (request.Data.Id != id)
        {
            return BadRequest(new ApiResponse<object>(
                400,
                MessageDescription.ApiResponseMessageDescription.IdMismatch,
                null));
        }

        await psychologyNoteService.UpdateDriveUrlAsync(id, request.Data.DriveUrl);
        return Ok(new ApiResponse<object>(
            200,
            MessageDescription.ApiResponseMessageDescription.Updated,
            null));
    }
}
