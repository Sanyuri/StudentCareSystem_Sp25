using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

using StudentCareSystem.Domain.Entities;
using StudentCareSystem.Domain.Enums;
using StudentCareSystem.Domain.Interfaces;
using StudentCareSystem.Infrastructure.Data;

namespace StudentCareSystem.Infrastructure.Repositories;


public class EmailLogRepository(ScsDbContext context, IHttpContextAccessor httpContext) : BaseRepository<EmailLog>(context, httpContext), IEmailLogRepository
{
    private readonly ScsDbContext _context = context;
    public async Task<Dictionary<EmailState, int>> CountByDateAsync(DateTime dateTime)
    {
        return await _context.EmailLogs
            .Where(x => x.CreatedAt.Date == dateTime)
            .GroupBy(x => x.EmailState)
            .Select(x => new { x.Key, Count = x.Count() })
            .ToDictionaryAsync(x => x.Key, x => x.Count);
    }
}
