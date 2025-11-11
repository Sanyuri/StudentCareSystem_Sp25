using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

using StudentCareSystem.Application.Commons.Interfaces;
using StudentCareSystem.Application.Commons.Models.Apis;
using StudentCareSystem.Application.Commons.Models.Stringees;

namespace StudentCareSystem.API.Controllers;

public class StringeesController(
    IStringeeService stringeeService
) : BaseController
{
    /// <summary>
    /// Get a Stringee access token for the current user.
    /// </summary>
    /// <returns>The Stringee access token and its expiration time.</returns>
    [HttpGet("token")]
    public async Task<IActionResult> GetToken()
    {
        var result = await stringeeService.CreateStringeeTokenASync();
        return Ok(new ApiResponse<GetStringeeAccessTokenDto>(
            200,
            "Stringee access token generated successfully.",
            result
        ));
    }
}
