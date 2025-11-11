using Microsoft.AspNetCore.Mvc;

using StudentCareSystem.Application.Commons.Interfaces;
using StudentCareSystem.Application.Commons.Models.Apis;
using StudentCareSystem.Application.Commons.Models.EmailSamples;
using StudentCareSystem.Domain.Constants;
using StudentCareSystem.Domain.Enums;
using StudentCareSystem.Domain.Helpers;
using StudentCareSystem.Infrastructure.Attributes;

namespace StudentCareSystem.API.Controllers;

/// <summary>
/// Represents a controller for managing email samples.
/// </summary>
/// /// [ApiController]
public class EmailSamplesController(IEmailSampleService emailSampleService) : BaseController
{
    private readonly IEmailSampleService _emailSampleService = emailSampleService;

    /// <summary>
    /// Gets all email samples.
    /// </summary>
    /// <returns>A list of all email samples with an HTTP 200 status code.</returns>
    [HttpGet]
    [RequiredPermission(PermissionType.ReadEmailSample)]
    public async Task<IActionResult> GetAll([FromQuery] EmailSampleFilter filter)
    {
        var emailSampleDtos = await _emailSampleService.GetAllWithPaginationAsync(filter);
        var response = new ApiResponse<Pagination<GetEmailSampleDto>>(
            status: 200,
            message: MessageDescription.ApiResponseMessageDescription.Success,
            data: emailSampleDtos);
        return Ok(response);
    }

    /// <summary>
    /// Gets an email sample by its ID.
    /// </summary>
    /// <param name="id">The ID of the email sample.</param>
    /// <returns>The email sample with the specified ID, or HTTP 404 if not found.</returns>
    [HttpGet("{id}")]
    [RequiredPermission(PermissionType.ReadEmailSample)]
    public async Task<IActionResult> GetById(Guid id)
    {
        var emailSampleDto = await _emailSampleService.GetByIdAsync(id);
        var response = new ApiResponse<GetEmailSampleDto>(
            status: 200,
            message: MessageDescription.ApiResponseMessageDescription.Success,
            data: emailSampleDto);
        return Ok(response);
    }

    /// <summary>
    /// Creates a new email sample.
    /// </summary>
    /// <param name="request">The email sample data to create.</param>
    /// <returns>Created email sample with HTTP 201 status code.</returns>
    [HttpPost]
    [RequiredPermission(PermissionType.WriteEmailSample)]
    public async Task<IActionResult> Create(ApiRequest<CreateEmailSampleDto> request)
    {
        var result = await _emailSampleService.AddAsync(request.Data);
        var response = new ApiResponse<GetEmailSampleDto>(
            status: 201,
            message: MessageDescription.ApiResponseMessageDescription.Created,
            data: result);
        return CreatedAtAction(nameof(GetById), new { id = result.Id }, response);
    }

    /// <summary>
    /// Updates an existing email sample.
    /// </summary>
    /// <param name="id">The ID of the email sample to update.</param>
    /// <param name="request">The updated email sample data.</param>
    /// <returns>Updated email sample with HTTP 200 status code, or HTTP 404 if not found.</returns>
    [HttpPut("{id}")]
    [RequiredPermission(PermissionType.WriteEmailSample)]
    public async Task<IActionResult> Update(ApiRequest<UpdateEmailSampleDto> request)
    {
        await _emailSampleService.UpdateAsync(request.Data);
        var response = new ApiResponse<UpdateEmailSampleDto>(
            status: 200,
            message: MessageDescription.ApiResponseMessageDescription.Updated,
            data: request.Data);
        return Ok(response);
    }

    /// <summary>
    /// Deletes an email sample by its ID.
    /// </summary>
    /// <param name="id">The ID of the email sample to delete.</param>
    /// <returns>HTTP 204 status code if successful, or HTTP 404 if not found.</returns>
    [HttpDelete("{id}")]
    [RequiredPermission(PermissionType.WriteEmailSample)]
    public async Task<IActionResult> Delete(Guid id)
    {
        await _emailSampleService.DeleteAsync(id);
        return Ok(new ApiResponse<object>(
            status: 200,
            message: MessageDescription.ApiResponseMessageDescription.Deleted,
            data: null
        ));
    }
}
