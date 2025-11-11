using Microsoft.AspNetCore.Mvc;

using StudentCareSystem.Application.Commons.Interfaces;
using StudentCareSystem.Application.Commons.Models.Apis;
using StudentCareSystem.Application.Commons.Models.Subjects;
using StudentCareSystem.Domain.Constants;
using StudentCareSystem.Domain.Enums;
using StudentCareSystem.Domain.Helpers;
using StudentCareSystem.Infrastructure.Attributes;

namespace StudentCareSystem.API.Controllers;

public class SubjectsController(
    ISubjectService studentSubjectService
) : BaseController
{
    [HttpGet]
    [RequiredPermission(PermissionType.ReadStudentSubject)]
    public async Task<IActionResult> GetAll([FromQuery] StudentSubjectFilter filter)
    {
        var studentSubjects = await studentSubjectService.GetAllWithPaginationAsync(filter);
        return Ok(new ApiResponse<Pagination<GetSubjectDto>>(
            200,
            MessageDescription.ApiResponseMessageDescription.Success,
            studentSubjects));
    }

    [HttpGet("{id}")]
    [RequiredPermission(PermissionType.ReadStudentSubject)]
    public async Task<IActionResult> GetById(Guid id)
    {
        var studentSubject = await studentSubjectService.GetByIdAsync(id);
        return Ok(new ApiResponse<GetSubjectDto>(
            200,
            MessageDescription.ApiResponseMessageDescription.Success,
            studentSubject));
    }

    [HttpPut("attendance-free")]
    [RequiredPermission(PermissionType.WriteStudentSubject)]
    public async Task<IActionResult> AddAttendanceFreeSubjects(ApiRequest<AddAttendanceFreeSubjectsDto> addTakeAttendanceSubjectRequest)
    {
        await studentSubjectService.AddAttendanceFreeSubjectsAsync(addTakeAttendanceSubjectRequest.Data);
        return Ok(new ApiResponse<string>(
            200,
            MessageDescription.ApiResponseMessageDescription.Updated,
            "Successfully updated take attendances subjects."));
    }

    [HttpPut("{id}")]
    [RequiredPermission(PermissionType.WriteStudentSubject)]
    public async Task<IActionResult> UpdateSubject(Guid id, ApiRequest<UpdateSubjectDto> updateTakeAttendanceSubjectRequest)
    {
        if (id != updateTakeAttendanceSubjectRequest.Data.Id)
        {
            return BadRequest(new ApiResponse<string>(400,
            MessageDescription.ApiResponseMessageDescription.IdMismatch, null));
        }
        await studentSubjectService.UpdateSubjectAsync(updateTakeAttendanceSubjectRequest.Data);
        return Ok(new ApiResponse<string>(
            200,
            MessageDescription.ApiResponseMessageDescription.Updated,
            "Successfully updated take attendances subject."));
    }
}
