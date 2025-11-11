using Microsoft.AspNetCore.Mvc;

using StudentCareSystem.Application.Commons.Interfaces;
using StudentCareSystem.Application.Commons.Models.Apis;
using StudentCareSystem.Application.Commons.Models.Otps;
using StudentCareSystem.Domain.Constants;

namespace StudentCareSystem.API.Controllers;

public class MfaController
(
    IOtpService otpService
) : BaseController
{
    [HttpPost("enable")]
    public async Task<IActionResult> EnableOtp()
    {
        var response = await otpService.EnableOtpAsync();
        return Ok(new ApiResponse<EnableOtpResponse>(
            200,
            MessageDescription.ApiResponseMessageDescription.Success,
            response));
    }

    [HttpPost("disable")]
    public async Task<IActionResult> DisableOtp()
    {
        await otpService.DisableOtpAsync();
        return Ok(new ApiResponse<string>(
            200,
            MessageDescription.ApiResponseMessageDescription.Success,
            "MFA disabled successfully"));
    }

    [HttpPost("verify")]
    public async Task<IActionResult> VerifyOtp(ApiRequest<VerifyOtpDto> verifyOtpDto)
    {
        var result = await otpService.VerifyOtpAsync(verifyOtpDto.Data);
        return Ok(new ApiResponse<string>(
            200,
            MessageDescription.ApiResponseMessageDescription.Success,
            result));
    }

}
