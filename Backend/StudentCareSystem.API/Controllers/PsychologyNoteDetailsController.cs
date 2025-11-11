using Microsoft.AspNetCore.Mvc;

using StudentCareSystem.Application.Commons.Interfaces;
using StudentCareSystem.Application.Commons.Models.Apis;
using StudentCareSystem.Application.Commons.Models.PsychologyNoteDetails;
using StudentCareSystem.Domain.Constants;
using StudentCareSystem.Domain.Enums;
using StudentCareSystem.Infrastructure.Attributes;

namespace StudentCareSystem.API.Controllers;

[StudentPsychology]
public class PsychologyNoteDetailsController(
    IPsychologyNoteDetailService psychologyNoteDetailService
) : BaseController
{

    /// <summary>
    /// Get a psychology note detail by ID.
    /// </summary>
    /// <param name="id">The ID of the psychology note detail.</param>
    /// <returns>The psychology note detail with the specified ID.</returns>
    [HttpGet("{id}")]
    [RequiredPermission(PermissionType.ReadPsychologicalNote)]
    public async Task<IActionResult> GetById(Guid id)
    {
        var noteDetail = await psychologyNoteDetailService.GetByIdAsync(id);
        return Ok(new ApiResponse<GetPsychologyNoteDetailDto>(
            200,
            MessageDescription.ApiResponseMessageDescription.Success,
            noteDetail));
    }

    /// <summary>
    /// Add a new psychology note detail.
    /// </summary>
    /// <param name="createPsychologyNoteDetailDto">The data for the new psychology note detail.</param>
    /// <returns>The created psychology note detail.</returns>
    [HttpPost]
    [RequiredPermission(PermissionType.WritePsychologicalNote)]
    public async Task<IActionResult> Add(ApiRequest<CreatePsychologyNoteDetailDto> createPsychologyNoteDetailDto)
    {
        var noteDetail = await psychologyNoteDetailService.AddAsync(createPsychologyNoteDetailDto.Data);
        return CreatedAtAction(nameof(GetById), new { id = noteDetail.Id },
            new ApiResponse<GetPsychologyNoteDetailDto>(
                201,
                MessageDescription.ApiResponseMessageDescription.Created,
                noteDetail));
    }

    /// <summary>
    /// Update an existing psychology note detail.
    /// </summary>
    /// <param name="updatePsychologyNoteDetailDto">The data for updating the psychology note detail.</param>
    /// <param name="id">The ID of the psychology note detail to update.</param>
    /// <returns>No content.</returns>
    [HttpPut("{id}")]
    [RequiredPermission(PermissionType.WritePsychologicalNote)]
    public async Task<IActionResult> Update(ApiRequest<UpdatePsychologyNoteDetailDto> updatePsychologyNoteDetailDto, Guid id)
    {
        if (updatePsychologyNoteDetailDto.Data.Id != id)
        {
            return BadRequest(new ApiResponse<GetPsychologyNoteDetailDto>(
                400,
                MessageDescription.ApiResponseMessageDescription.IdMismatch,
                null));
        }
        await psychologyNoteDetailService.UpdateAsync(updatePsychologyNoteDetailDto.Data);
        return Ok(new ApiResponse<GetPsychologyNoteDetailDto>(
            200,
            MessageDescription.ApiResponseMessageDescription.Updated,
            null));
    }

    /// <summary>
    /// Delete a psychology note detail by ID.
    /// </summary>
    /// <param name="id">The ID of the psychology note detail to delete.</param>
    /// <returns>No content.</returns>
    [HttpDelete("{id}")]
    [RequiredPermission(PermissionType.WritePsychologicalNote)]
    public async Task<IActionResult> Delete(Guid id)
    {
        await psychologyNoteDetailService.DeleteAsync(id);
        return Ok(new ApiResponse<GetPsychologyNoteDetailDto>(
            200,
            MessageDescription.ApiResponseMessageDescription.Deleted,
            null));
    }
}
