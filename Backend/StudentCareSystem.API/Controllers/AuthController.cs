using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

using StudentCareSystem.Application.Commons.Interfaces;
using StudentCareSystem.Application.Commons.Models.Apis;
using StudentCareSystem.Application.Commons.Models.Authentications;
using StudentCareSystem.Domain.Constants;
using StudentCareSystem.Domain.Enums;
using StudentCareSystem.Infrastructure.Attributes;


namespace StudentCareSystem.API.Controllers;

public class AuthController(
    IAuthService authService
) : BaseController
{
    /// <summary>
    /// Get a new JWT token using the refresh token
    /// </summary>
    /// <returns></returns>
    [AllowAnonymous]
    [HttpPost("refresh-token")]
    public async Task<IActionResult> RefreshToken([FromBody] ApiRequest<RefreshTokenDto> request)
    {
        var result = await authService.RefreshTokenAsync(request.Data);
        return Ok(new ApiResponse<RefreshTokenDto>(
            200,
            MessageDescription.ApiResponseMessageDescription.Success,
            result));
    }

    /// <summary>
    /// Login with Google
    /// </summary>
    [HttpPost("signin-google")]
    [AllowAnonymous]
    [IgnoreAntiforgeryToken]
    public async Task<IActionResult> SigninGoogle([FromBody] ApiRequest<GoogleAuthRequest> request)
    {
        var result = await authService.LoginWithGoogleAsync(request.Data);
        return Ok(new ApiResponse<AuthResponse>(
            200,
            MessageDescription.ApiResponseMessageDescription.Success,
            result));
    }

    /// <summary>
    /// Logout the user
    /// </summary>
    /// <param name="request"></param>
    /// <returns></returns>
    [HttpPost("logout")]
    public async Task<IActionResult> Logout([FromBody] ApiRequest<LogoutRequest> request)
    {
        await authService.LogoutAsync(request.Data);
        return Ok(new ApiResponse<string>(200,
        MessageDescription.ApiResponseMessageDescription.Success,
        "Logout successfully"));
    }

    [HttpPost("sign-as-user")]
    [RequiredPermission(PermissionType.OnlyForAdmin)]
    public async Task<IActionResult> SignAsUser(Guid userId)
    {
        var result = await authService.SignAsUserAsync(userId);
        return Ok(new ApiResponse<AuthResponse>(
            200,
            MessageDescription.ApiResponseMessageDescription.Success,
            result));
    }
}
