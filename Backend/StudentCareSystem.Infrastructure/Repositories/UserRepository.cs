using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

using StudentCareSystem.Domain.Entities;
using StudentCareSystem.Domain.Enums;
using StudentCareSystem.Domain.Interfaces;
using StudentCareSystem.Infrastructure.Data;

namespace StudentCareSystem.Infrastructure.Repositories;

public class UserRepository(ScsDbContext context, IHttpContextAccessor httpContext)
 : BaseRepository<User>(context, httpContext), IUserRepository
{
    private readonly ScsDbContext _context = context;
    public async Task<User?> GetByEmailAsync(string dataEmail)
    {
        return await _context.Users
            .Include(x => x.Role)
            .Include(x => x.RefreshTokens)
            .Include(x => x.UserPermissions)
            .ThenInclude(x => x.Permission)
            .AsSplitQuery()
            .FirstOrDefaultAsync(x => x.Email == dataEmail);
    }

    public async Task<User?> GetUserByRefreshToken(string refreshToken)
    {
        return await _context
            .Users
            .Include(x => x.RefreshTokens)
            .FirstOrDefaultAsync(x => x.RefreshTokens.Any(t => t.Token == refreshToken));
    }

    public async Task<IEnumerable<User>> GetAllWithIncludeAsync()
    {
        return await _context.Users
        .Include(x => x.Role)
        .Include(x => x.UserPermissions)
        .Include(x => x.RefreshTokens)
        .AsSplitQuery()
        .ToListAsync();
    }

    public async Task<IEnumerable<string>> GetAllEmailByRoleAsync(RoleType roleType)
    {
        var emails = await _context.Users
            .Include(x => x.Role)
            .Where(x => x.Role != null && x.Role.RoleType == roleType)
            .Select(x => x.Email)
            .ToListAsync();

        return emails;
    }

    public async Task<IEnumerable<string>> GetAllFEEmailInRoleAsync(IEnumerable<RoleType> roleTypes)
    {
        var emails = await _context.Users
            .Include(x => x.Role)
            .Where(x => x.Role != null && roleTypes.Contains(x.Role.RoleType))
            .Select(x => string.IsNullOrEmpty(x.FeEmail) ? x.Email : x.FeEmail)
            .ToListAsync();

        return emails;
    }

    public Task<User?> GetByIdWithRoleAsync(Guid id)
    {
        return _context.Users
            .Include(x => x.Role)
            .Include(x => x.UserPermissions)
            .ThenInclude(x => x.Permission)
            .AsSplitQuery()
            .FirstOrDefaultAsync(x => x.Id == id);
    }
}
