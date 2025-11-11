using Microsoft.AspNetCore.Antiforgery;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

using StudentCareSystem.Application.Commons.Models.Apis;

namespace StudentCareSystem.API.Controllers;

public class CsrfController : BaseController
{
    [HttpGet("token")]
    [IgnoreAntiforgeryToken]
    [ProducesResponseType<object>(200)]
    [AllowAnonymous]
    public IActionResult GetToken([FromServices] IAntiforgery antiForgery)
    {
        var tokens = antiForgery.GetAndStoreTokens(HttpContext);
        //check if tokens is null
        if (tokens.RequestToken == null)
        {
            return BadRequest(new ApiResponse<AntiforgeryTokenSet>(400, "Token not returned", null));
        }
        return Ok(new ApiResponse<object>(200, "Token returned", new { token = tokens.RequestToken }));
    }
}
