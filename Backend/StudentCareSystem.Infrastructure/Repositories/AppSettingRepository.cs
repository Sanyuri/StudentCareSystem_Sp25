using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

using StudentCareSystem.Domain.Entities;
using StudentCareSystem.Domain.Interfaces;
using StudentCareSystem.Infrastructure.Data;

namespace StudentCareSystem.Infrastructure.Repositories;

public class AppSettingRepository(ScsDbContext context, IHttpContextAccessor httpContext)
 : BaseRepository<AppSetting>(context, httpContext), IAppSettingRepository
{
    private readonly ScsDbContext _context = context;
    public async Task<AppSetting?> GetByKeyAsync(string key)
    {
        return await _context.AppSettings
            .FirstOrDefaultAsync(x => x.Key == key);
    }
}
