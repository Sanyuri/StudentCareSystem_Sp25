using Microsoft.EntityFrameworkCore;

using StudentCareSystem.Domain.Entities;
using StudentCareSystem.Domain.Interfaces;
using StudentCareSystem.Infrastructure.Data;

namespace StudentCareSystem.Infrastructure.Repositories;

public class RefreshTokenRepository(ScsDbContext context) : IRefreshTokenRepository
{
    private readonly ScsDbContext _context = context;
    public async Task DeleteAsync(RefreshToken entity)
    {
        _context.RefreshTokens.Remove(entity);
        await _context.SaveChangesAsync();
    }
    public async Task AddAsync(RefreshToken entity)
    {
        await _context.RefreshTokens.AddAsync(entity);
        await _context.SaveChangesAsync();
    }
    public async Task<RefreshToken?> GetByTokenAsync(string token)
    {
        return await _context.RefreshTokens.FirstOrDefaultAsync(x => x.Token == token);
    }
}
