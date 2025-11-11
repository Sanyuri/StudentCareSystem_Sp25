using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

using StudentCareSystem.Domain.Entities;
using StudentCareSystem.Domain.Interfaces;
using StudentCareSystem.Infrastructure.Data;

namespace StudentCareSystem.Infrastructure.Repositories;

public class PermissionRepository(ScsDbContext context, IHttpContextAccessor httpContextAccessor)
    : BaseRepository<Permission>(context, httpContextAccessor), IPermissionRepository
{
    private readonly ScsDbContext _context = context;
    public async Task<IEnumerable<Permission>> GetByIdsAsync(List<Guid> ids)
    {
        return await _context.Permissions.Where(x => ids.Contains(x.Id)).ToListAsync();
    }

    public async Task<IEnumerable<Permission>> GetByRoleAsync(Guid roleId)
    {
        return await _context.Permissions
            .Where(x => x.RolePermissions.Any(y => y.RoleId == roleId))
            .ToListAsync();
    }
}
