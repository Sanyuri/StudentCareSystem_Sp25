using Microsoft.AspNetCore.Http;

using OtpNet;

using StudentCareSystem.Application.Commons.Exceptions;
using StudentCareSystem.Application.Commons.Interfaces;
using StudentCareSystem.Application.Commons.Models.Otps;
using StudentCareSystem.Domain.Interfaces;
using StudentCareSystem.Infrastructure.Utilities;

namespace StudentCareSystem.Application.Services;

public class OtpService(
    IUserRepository userRepository,
    IHttpContextAccessor httpContextAccessor,
    IUnitOfWork unitOfWork
) : IOtpService
{
    public async Task<EnableOtpResponse> EnableOtpAsync()
    {
        var useEmail = ClaimsHelper.GetUserEmail(httpContextAccessor)
            ?? throw new BadRequestException("Email not found");
        var user = await userRepository.GetByEmailAsync(useEmail)
            ?? throw new EntityNotFoundException("User not found");
        var secretKey = GenerateSecretKey();
        user.TOtpSecret = secretKey;
        user.IsEnable2Fa = true;
        userRepository.Update(user);
        await unitOfWork.SaveChangesAsync();
        var uri = GenerateUri(user.Email, secretKey);
        return new EnableOtpResponse
        {
            Secret = secretKey,
            Uri = uri
        };
    }

    public async Task DisableOtpAsync()
    {
        var userId = ClaimsHelper.GetUserId(httpContextAccessor);
        var user = await userRepository.GetByIdAsync(userId)
            ?? throw new EntityNotFoundException("User not found");
        user.TOtpSecret = string.Empty;
        user.IsEnable2Fa = false;
        userRepository.Update(user);
        await unitOfWork.SaveChangesAsync();

    }

    public async Task<string> VerifyOtpAsync(VerifyOtpDto verifyOtpDto)
    {
        var userEmail = ClaimsHelper.GetUserEmail(httpContextAccessor)
            ?? throw new BadRequestException("Email not found");
        var user = await userRepository.GetByEmailAsync(userEmail)
            ?? throw new EntityNotFoundException("User not found");
        var secret = Base32Encoding.ToBytes(user.TOtpSecret);
        var totp = new Totp(secret);
        if (!totp.VerifyTotp(verifyOtpDto.Otp, out _))
        {
            throw new BadRequestException("Invalid OTP");
        }
        return "OTP is valid";
    }

    private static string GenerateSecretKey()
    {
        var key = KeyGeneration.GenerateRandomKey(20);
        return Base32Encoding.ToString(key);
    }

    private static string GenerateUri(string email, string secret)
    {
        return $"otpauth://totp/{email}?secret={secret}&issuer=StudentCareSystem";
    }
}
