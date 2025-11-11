using Microsoft.AspNetCore.Mvc;

using StudentCareSystem.Application.Commons.Interfaces;
using StudentCareSystem.Application.Commons.Models.Apis;
using StudentCareSystem.Application.Commons.Models.Students;
using StudentCareSystem.Domain.Constants;
using StudentCareSystem.Domain.Enums;
using StudentCareSystem.Domain.Helpers;
using StudentCareSystem.Infrastructure.Attributes;

namespace StudentCareSystem.API.Controllers;

public class StudentsController(IStudentService studentService) : BaseController
{
    [HttpGet]
    [RequiredPermission(PermissionType.ReadStudent)]
    public async Task<IActionResult> GetAll([FromQuery] StudentFilter filter)
    {
        var students = await studentService.GetAllWithPaginationAsync(filter);
        return Ok(new ApiResponse<Pagination<GetStudentDto>>(
            200,
            MessageDescription.ApiResponseMessageDescription.Success,
            students));
    }

    [HttpGet("{studentCode}")]
    [RequiredPermission(PermissionType.ReadStudent)]
    public async Task<IActionResult> GetByStudentCode(string studentCode)
    {
        var student = await studentService.GetByStudentCodeAsync(studentCode);
        return Ok(new ApiResponse<GetStudentDto>(
            200,
            MessageDescription.ApiResponseMessageDescription.Success,
            student));
    }
}
