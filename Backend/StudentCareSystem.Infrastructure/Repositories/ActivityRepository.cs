using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

using StudentCareSystem.Domain.Entities;
using StudentCareSystem.Domain.Interfaces;
using StudentCareSystem.Infrastructure.Data;

namespace StudentCareSystem.Infrastructure.Repositories;

public class ActivityRepository(
    ScsDbContext context,
    IHttpContextAccessor httpContext
) : BaseRepository<Activity>(context, httpContext), IActivityRepository
{
    private readonly ScsDbContext _context = context;

    public async Task<IEnumerable<Activity>> GetAllActivity()
    {
        return await _context.Activities.Include(u => u.User).ToListAsync();
    }
}
