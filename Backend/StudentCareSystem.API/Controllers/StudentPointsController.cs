using Microsoft.AspNetCore.Mvc;

using StudentCareSystem.Application.Commons.Interfaces;
using StudentCareSystem.Application.Commons.Models.Apis;
using StudentCareSystem.Application.Commons.Models.Points;
using StudentCareSystem.Domain.Constants;
using StudentCareSystem.Domain.Enums;
using StudentCareSystem.Domain.Helpers;
using StudentCareSystem.Infrastructure.Attributes;

namespace StudentCareSystem.API.Controllers;

public class StudentPointsController(
    IStudentPointService studentPointService
) : BaseController
{
    [HttpGet]
    [RequiredPermission(PermissionType.ReadStudentPoint)]
    public async Task<IActionResult> GetAll([FromQuery] StudentPointFilter filter)
    {
        var studentPoints = await studentPointService.GetAllWithPaginationAsync(filter);
        return Ok(new ApiResponse<Pagination<GetStudentPointDto>>(
            200,
            MessageDescription.ApiResponseMessageDescription.Success,
            studentPoints));
    }

    [HttpGet("failed-subject/{studentCode}")]
    [RequiredPermission(PermissionType.ReadStudentPoint)]
    public async Task<IActionResult> GetCurrentFailedSubjectByStudentCode(string studentCode)
    {
        var failedSubjects = await studentPointService.GetCurrentFailedSubjectByStudentCodeAsync(studentCode);
        return Ok(new ApiResponse<IEnumerable<GetStudentPointDto>>(
            200,
            MessageDescription.ApiResponseMessageDescription.Success,
            failedSubjects));
    }

    [HttpGet("student-point/{studentCode}")]
    [RequiredPermission(PermissionType.ReadStudentPoint)]
    public async Task<IActionResult> GetAllStudentPointByStudentCodeInSemesters([FromRoute] string studentCode, [FromQuery] string[] semesters)
    {
        var studentPoints = await studentPointService.GetAllStudentPointByStudentCodeAndInSemestersAsync(studentCode, semesters);
        return Ok(new ApiResponse<IEnumerable<GetStudentPointDto>>(
            200,
            MessageDescription.ApiResponseMessageDescription.Success,
            studentPoints));
    }

    [HttpGet("last-updated-date")]
    [RequiredPermission(PermissionType.ReadStudentPoint)]
    public async Task<IActionResult> GetLastUpdatedDate()
    {
        var lastUpdatedDate = await studentPointService.GetLastUpdatedDateAsync();
        return Ok(new ApiResponse<DateTime?>(
            200,
            MessageDescription.ApiResponseMessageDescription.Success,
            lastUpdatedDate));
    }

    [HttpGet("export")]
    [RequiredPermission(PermissionType.ReadStudentPoint)]
    public async Task<IActionResult> GetAllForExport([FromQuery] StudentFailedFilter filter)
    {
        var studentPoints = await studentPointService.GetStudentsWithFailedSubjectsAsync(filter);
        return Ok(new ApiResponse<Pagination<GetStudentFailedDto>>(
            200,
            MessageDescription.ApiResponseMessageDescription.Success,
            studentPoints));
    }
}
