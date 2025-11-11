using StudentCareSystem.Domain.Entities;

namespace StudentCareSystem.Domain.Interfaces;

public interface IRefreshTokenRepository
{
    Task DeleteAsync(RefreshToken entity);
    Task AddAsync(RefreshToken entity);
    Task<RefreshToken?> GetByTokenAsync(string token);
}
