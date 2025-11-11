using Microsoft.AspNetCore.Mvc;

using StudentCareSystem.Application.Commons.Interfaces;
using StudentCareSystem.Application.Commons.Models.Apis;
using StudentCareSystem.Application.Commons.Models.EmailSubSamples;
using StudentCareSystem.Domain.Constants;
using StudentCareSystem.Domain.Enums;
using StudentCareSystem.Domain.Helpers;
using StudentCareSystem.Infrastructure.Attributes;

namespace StudentCareSystem.API.Controllers;

public class EmailSubSamplesController(
    IEmailSubSampleService emailSubSampleService
) : BaseController
{

    /// <summary>
    /// Gets all email sub-samples.
    /// </summary>
    /// <returns>A list of all email sub-samples with an HTTP 200 status code.</returns>
    [HttpGet]
    [RequiredPermission(PermissionType.ReadEmailSample)]
    public async Task<IActionResult> GetAll([FromQuery] EmailSubSampleFilter filter)
    {
        var emailSubSampleDtos = await emailSubSampleService.GetAllWithPaginationAsync(filter);
        var response = new ApiResponse<Pagination<GetEmailSubSampleDto>>(
            status: 200,
            message: MessageDescription.ApiResponseMessageDescription.Success,
            data: emailSubSampleDtos);
        return Ok(response);
    }

    /// <summary>
    /// Gets an email sub-sample by its ID.
    /// </summary>
    /// <param name="id">The ID of the email sub-sample.</param>
    /// <returns>The email sub-sample with the specified ID, or HTTP 404 if not found.</returns>
    [HttpGet("{id}")]
    [RequiredPermission(PermissionType.ReadEmailSample)]
    public async Task<IActionResult> GetById(Guid id)
    {
        var emailSubSampleDto = await emailSubSampleService.GetByIdAsync(id);
        var response = new ApiResponse<GetEmailSubSampleDto>(
            status: 200,
            message: MessageDescription.ApiResponseMessageDescription.Success,
            data: emailSubSampleDto);
        return Ok(response);
    }

    /// <summary>
    /// Creates a new email sub-sample.
    /// </summary>
    /// <param name="request">The email sub-sample data to create.</param>
    /// <returns>Created email sub-sample with HTTP 201 status code.</returns>
    [HttpPost]
    [RequiredPermission(PermissionType.WriteEmailSample)]
    public async Task<IActionResult> Create(ApiRequest<CreateEmailSubSampleDto> request)
    {
        var result = await emailSubSampleService.AddAsync(request.Data);
        var response = new ApiResponse<GetEmailSubSampleDto>(
            status: 201,
            message: MessageDescription.ApiResponseMessageDescription.Created,
            data: result);
        return CreatedAtAction(nameof(GetById), new { id = result.Id }, response);
    }

    /// <summary>
    /// Updates an existing email sub-sample.
    /// </summary>
    /// <param name="id">The ID of the email sub-sample to update.</param>
    /// <param name="request">The updated email sub-sample data.</param>
    /// <returns>Updated email sub-sample with HTTP 200 status code, or HTTP 404 if not found.</returns>
    [HttpPut("{id}")]
    [RequiredPermission(PermissionType.WriteEmailSample)]
    public async Task<IActionResult> Update(Guid id, ApiRequest<UpdateEmailSubSampleDto> request)
    {
        request.Data.Id = id;
        await emailSubSampleService.UpdateAsync(request.Data);
        var response = new ApiResponse<UpdateEmailSubSampleDto>(
            status: 200,
            message: MessageDescription.ApiResponseMessageDescription.Updated,
            data: request.Data);
        return Ok(response);
    }

    /// <summary>
    /// Deletes an email sub-sample by its ID.
    /// </summary>
    /// <param name="id">The ID of the email sub-sample to delete.</param>
    /// <returns>HTTP 204 status code if successful, or HTTP 404 if not found.</returns>
    [HttpDelete("{id}")]
    [RequiredPermission(PermissionType.WriteEmailSample)]
    public async Task<IActionResult> Delete(Guid id)
    {
        await emailSubSampleService.DeleteAsync(id);
        return Ok(new ApiResponse<object>(
            status: 200,
            message: MessageDescription.ApiResponseMessageDescription.Deleted,
            data: null
        ));
    }
}
