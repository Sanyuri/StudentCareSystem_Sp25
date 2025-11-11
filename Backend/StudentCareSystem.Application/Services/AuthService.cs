using System.Security.Claims;

using Finbuckle.MultiTenant.Abstractions;

using Google.Apis.Auth;

using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;

using StudentCareSystem.Application.Commons.Exceptions;
using StudentCareSystem.Application.Commons.Interfaces;
using StudentCareSystem.Application.Commons.Models;
using StudentCareSystem.Application.Commons.Models.Authentications;
using StudentCareSystem.Application.Commons.Utilities;
using StudentCareSystem.Domain.Constants;
using StudentCareSystem.Domain.Entities;
using StudentCareSystem.Domain.Enums;
using StudentCareSystem.Domain.Interfaces;
using StudentCareSystem.Infrastructure.Models;
using StudentCareSystem.Infrastructure.Models.Tenant;
using StudentCareSystem.Infrastructure.Utilities;

namespace StudentCareSystem.Application.Services;

public class AuthService(
    IOptions<JwtSetting> options,
    IOptions<GoogleSetting> gOptions,
    IHttpContextAccessor httpContextAccessor,
    IUnitOfWork unitOfWork,
    IMultiTenantContextAccessor<AppTenantInfo> tenantContextAccessor
) : IAuthService
{
    private readonly JwtSetting jwtSetting = options.Value;
    private readonly GoogleSetting googleSetting = gOptions.Value;
    private readonly string tenantIdentifier = tenantContextAccessor.MultiTenantContext?.TenantInfo?.Identifier
        ?? throw new ArgumentNullException(nameof(tenantContextAccessor));

    public async Task<AuthResponse> LoginWithGoogleAsync(GoogleAuthRequest authRequest)
    {
        try
        {
            var payload = await ValidateGoogleTokenAsync(authRequest.Code);
            var email = payload.Email;
            var user = await unitOfWork.UserRepository.GetByEmailAsync(email)
                ?? throw new UnauthorizedAccessException(MessageDescription.ExceptionMessageDescription.EntityNotFound("User"));
            if (user.Status == UserStatus.Inactive)
            {
                throw new UnauthorizedAccessException("This account cannot log into server");
            }
            var accessToken = GenerateAccessToken(user, tenantIdentifier);
            var refreshToken = await GenerateRefreshTokenAsync(user);
            //Log activity
            var activity = new Activity
            {
                ActivityDescription = ActivityDescription.LoginDescription + $" [{user.Email}]",
                ActivityType = ActivityType.Login,
                UserId = user.Id,
            };
            await unitOfWork.ActivityRepository.AddAsync(activity);
            await unitOfWork.SaveChangesAsync();
            var authResponse = new AuthResponse
            {
                JwtToken = accessToken,
                RefreshToken = refreshToken,
                Email = user.Email,
                Name = user.UserName,
                Image = payload.Picture,
                Role = user.Role?.RoleType.ToString() ?? "",
            };
            return authResponse;
        }
        catch (InvalidJwtException ex)
        {
            throw new UnauthorizedAccessException(MessageDescription.ExceptionMessageDescription.Invalid("token"), ex);
        }

    }

    public async Task LogoutAsync(LogoutRequest logoutRequest)
    {
        var userEmail = ClaimsHelper.GetUserEmail(httpContextAccessor)
            ?? throw new UnauthorizedAccessException(MessageDescription.ExceptionMessageDescription.EntityNotFound("User"));
        var user = await unitOfWork.UserRepository.GetByEmailAsync(userEmail)
            ?? throw new UnauthorizedAccessException(MessageDescription.ExceptionMessageDescription.EntityNotFound("User"));
        var refreshTokens = user.RefreshTokens;
        var refreshToken = refreshTokens.FirstOrDefault(x => x.Token == logoutRequest.RefreshToken)
            ?? throw new UnauthorizedAccessException(MessageDescription.ExceptionMessageDescription.Invalid("refresh token"));
        await unitOfWork.RefreshTokenRepository.DeleteAsync(refreshToken);
        await unitOfWork.SaveChangesAsync();
    }

    public async Task<RefreshTokenDto> RefreshTokenAsync(RefreshTokenDto refreshTokenDto)
    {
        var refreshToken = await unitOfWork.RefreshTokenRepository.GetByTokenAsync(refreshTokenDto.RefreshToken)
            ?? throw new UnauthorizedAccessException(MessageDescription.ExceptionMessageDescription.Invalid("refresh token"));
        if (refreshToken.ExpiryTime < DateTime.UtcNow)
        {
            throw new UnauthorizedAccessException($"Refresh {MessageDescription.ExceptionMessageDescription.TokenExpired}");
        }
        var user = await unitOfWork.UserRepository.GetByIdAsync(refreshToken.UserId)
            ?? throw new UnauthorizedAccessException(MessageDescription.ExceptionMessageDescription.EntityNotFound("User"));
        var accessToken = GenerateAccessToken(user, tenantIdentifier);
        refreshTokenDto.AccessToken = accessToken;
        return refreshTokenDto;
    }

    private string GenerateAccessToken(User user, string identifier)
    {
        var permission = user.UserPermissions?
            .Select(x => x.Permission?.PermissionType.ToString()
                ?? throw new ArgumentNullException(nameof(x.Permission)))
            .ToList();
        List<Claim> claims =
        [
            new(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new(ClaimTypes.Name, user.UserName),
            new(ClaimTypes.Email, user.Email),
            new(ClaimTypes.Role, user.Role?.RoleType.ToString() ?? ""),
            new("Identifier", identifier),
            new("Permissions", StringListConverter.ConvertListToString(permission)),
        ];
        return TokenHelper.GenerateAccessToken(claims, jwtSetting);
    }

    private async Task<string> GenerateRefreshTokenAsync(User user)
    {
        var refreshToken = new RefreshToken
        {
            Token = TokenHelper.GenerateRefreshToken(),
            ExpiryTime = DateTime.UtcNow.AddMilliseconds(jwtSetting.RefreshTokenExpiration),
            UserId = user.Id,
        };
        await unitOfWork.RefreshTokenRepository.AddAsync(refreshToken);
        return refreshToken.Token;
    }

    protected virtual async Task<GoogleJsonWebSignature.Payload> ValidateGoogleTokenAsync(string token)
    {
        return await GoogleJsonWebSignature.ValidateAsync(
            token,
            new GoogleJsonWebSignature.ValidationSettings()
            {
                Audience = [googleSetting.ClientId]
            });
    }

    public async Task<AuthResponse> SignAsUserAsync(Guid userId)
    {

        var targetUser = await unitOfWork.UserRepository.GetByIdWithRoleAsync(userId)
            ?? throw new EntityNotFoundException("User not found");

        if (targetUser.Status == UserStatus.Inactive)
        {
            throw new UnauthorizedAccessException("This account cannot log into server");
        }

        var accessToken = GenerateAccessToken(targetUser, tenantIdentifier);
        var refreshToken = await GenerateRefreshTokenAsync(targetUser);

        var currentUserId = ClaimsHelper.GetUserId(httpContextAccessor);
        var currentUserEmail = ClaimsHelper.GetUserEmail(httpContextAccessor)
            ?? throw new UnauthorizedAccessException(MessageDescription.ExceptionMessageDescription.EntityNotFound("User"));

        // Log the impersonation activity
        var activity = new Activity
        {
            ActivityDescription = $"Admin {currentUserEmail} signed in as {targetUser.Email}",
            ActivityType = ActivityType.AdminImpersonation,
            UserId = currentUserId,
        };
        await unitOfWork.ActivityRepository.AddAsync(activity);
        await unitOfWork.SaveChangesAsync();

        // Return auth response for the target user
        return new AuthResponse
        {
            JwtToken = accessToken,
            RefreshToken = refreshToken,
            Email = targetUser.Email,
            Name = targetUser.UserName,
            Role = targetUser.Role?.RoleType.ToString() ?? "",
            IsImpersonation = true
        };


    }
}
