using StudentCareSystem.Application.Commons.Models.Otps;

namespace StudentCareSystem.Application.Commons.Interfaces;

public interface IOtpService
{
    Task<EnableOtpResponse> EnableOtpAsync();
    Task DisableOtpAsync();
    Task<string> VerifyOtpAsync(VerifyOtpDto verifyOtpDto);
}
