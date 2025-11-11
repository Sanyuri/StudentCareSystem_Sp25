using StudentCareSystem.Application.Commons.Models.Authentications;

namespace StudentCareSystem.Application.Commons.Interfaces
{
    public interface IAuthService
    {
        Task<AuthResponse> LoginWithGoogleAsync(GoogleAuthRequest authRequest);
        Task<RefreshTokenDto> RefreshTokenAsync(RefreshTokenDto refreshTokenDto);
        Task LogoutAsync(LogoutRequest logoutRequest);
        Task<AuthResponse> SignAsUserAsync(Guid userId);
    }
};

