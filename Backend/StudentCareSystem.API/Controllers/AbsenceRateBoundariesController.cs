using Microsoft.AspNetCore.Mvc;

using StudentCareSystem.Application.Commons.Interfaces;
using StudentCareSystem.Application.Commons.Models.AbsenceRateBoundaries;
using StudentCareSystem.Application.Commons.Models.Apis;
using StudentCareSystem.Domain.Constants;
using StudentCareSystem.Domain.Enums;
using StudentCareSystem.Infrastructure.Attributes;

namespace StudentCareSystem.API.Controllers;

public class AbsenceRateBoundariesController(
    IAbsenceRateBoundaryService absenceRateBoundaryService
) : BaseController
{
    [HttpGet]
    [RequiredPermission(PermissionType.ReadAbsenceRateBoundary)]
    public async Task<IActionResult> GetAll()
    {
        var absenceRateBoundaries = await absenceRateBoundaryService.GetAllAsync();
        var response = new ApiResponse<IEnumerable<GetAbsenceRateBoundaryDto>>(
            status: 200,
            message: MessageDescription.ApiResponseMessageDescription.Success,
            data: absenceRateBoundaries);
        return Ok(response);
    }

    [HttpGet("{id}")]
    [RequiredPermission(PermissionType.ReadAbsenceRateBoundary)]
    public async Task<IActionResult> GetById(Guid id)
    {
        var absenceRateBoundary = await absenceRateBoundaryService.GetByIdAsync(id);
        var response = new ApiResponse<GetAbsenceRateBoundaryDto>(
            status: 200,
            message: MessageDescription.ApiResponseMessageDescription.Success,
            data: absenceRateBoundary);
        return Ok(response);
    }

    [HttpPost]
    [RequiredPermission(PermissionType.WriteAbsenceRateBoundary)]
    public async Task<IActionResult> Create(ApiRequest<CreateAbsenceRateBoundaryDto> request)
    {
        var result = await absenceRateBoundaryService.AddAsync(request.Data);
        var response = new ApiResponse<CreateAbsenceRateBoundaryDto>(
            status: 201,
            message: MessageDescription.ApiResponseMessageDescription.Created,
            data: request.Data);
        return CreatedAtAction(nameof(GetById), new { id = result.Id }, response);
    }

    [HttpPut("{id}")]
    [RequiredPermission(PermissionType.WriteAbsenceRateBoundary)]
    public async Task<IActionResult> Update(ApiRequest<UpdateAbsenceRateBoundaryDto> request, Guid id)
    {
        if (request.Data.Id != id)
        {
            return BadRequest(new ApiResponse<UpdateAbsenceRateBoundaryDto>(
                status: 400,
                message: MessageDescription.ApiResponseMessageDescription.IdMismatch,
                data: null));
        }

        await absenceRateBoundaryService.UpdateAsync(request.Data);
        var response = new ApiResponse<UpdateAbsenceRateBoundaryDto>(
            status: 200,
            message: MessageDescription.ApiResponseMessageDescription.Updated,
            data: request.Data);
        return Ok(response);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        await absenceRateBoundaryService.DeleteAsync(id);
        var response = new ApiResponse<object>(
            status: 200,
            message: MessageDescription.ApiResponseMessageDescription.Deleted,
            data: null);
        return Ok(response);
    }
}
