using Microsoft.AspNetCore.Mvc;

using StudentCareSystem.Application.Commons.Interfaces;
using StudentCareSystem.Application.Commons.Models.Apis;
using StudentCareSystem.Application.Commons.Models.Semesters;
using StudentCareSystem.Domain.Constants;

namespace StudentCareSystem.API.Controllers;

public class SemestersController(ISemesterService semesterService) : BaseController
{
    private readonly ISemesterService _semesterService = semesterService;

    /// <summary>
    /// Get current semester
    /// GET: api/Semester
    /// </summary>
    [HttpGet("semester")]
    public async Task<IActionResult> GetCurrentSemester()
    {
        //Get current semester from database
        var currentSemester = await _semesterService.GetCurrentSemesterAsync();
        return Ok(new ApiResponse<SemesterDto>(
            200,
            MessageDescription.ApiResponseMessageDescription.Success,
            currentSemester));
    }

    /// <summary>
    /// Get all semesters
    /// GET: api/Semester/all
    /// </summary>
    [HttpGet("semesters/all")]
    public async Task<IActionResult> GetAll()
    {
        //Get all semesters from database
        var semesters = await _semesterService.GetAllSemestersAsync();
        return Ok(new ApiResponse<IEnumerable<SemesterDto>>(
            200,
            MessageDescription.ApiResponseMessageDescription.Success,
            semesters));
    }
}
