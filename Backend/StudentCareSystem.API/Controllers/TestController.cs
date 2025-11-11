
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

using StudentCareSystem.Application.Commons.Interfaces;
using StudentCareSystem.Application.Commons.Models.Users;
using StudentCareSystem.Application.Commons.Utilities;
using StudentCareSystem.Domain.Entities;

using StudentCareSystem.Infrastructure.ExternalServices;
using StudentCareSystem.Infrastructure.Models.AIs;


namespace StudentCareSystem.API.Controllers;

[AllowAnonymous]
public class TestController(
    IAIService aiService
) : BaseController
{
    [HttpPost("test-ai")]
    public async Task<IActionResult> TestAiService([FromBody] TestAiRequest request)
    {
        await aiService.AnalyzeStudentNeedCareAsync(request.SemesterName);
        return Ok(new { Message = "AI Service endpoint test called successfully." });
    }

    public record TestAiRequest(string SemesterName);

    [HttpGet("test-get-student-need-care")]
    public async Task<IActionResult> TestGetStudentNeedCare([FromQuery] StudentResultRequest request)
    {
        var result = await aiService.GetStudentNeedCareAsync(new StudentResultRequest
        {
            SemesterName = request.SemesterName,
            OrderByTopsisScore = request.OrderByTopsisScore,
            PageNumber = request.PageNumber,
            PageSize = request.PageSize
        });
        return Ok(result);
    }



}
