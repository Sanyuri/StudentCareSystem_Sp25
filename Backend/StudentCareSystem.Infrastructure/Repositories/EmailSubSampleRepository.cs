using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

using StudentCareSystem.Domain.Entities;
using StudentCareSystem.Domain.Enums;
using StudentCareSystem.Domain.Interfaces;
using StudentCareSystem.Infrastructure.Data;

namespace StudentCareSystem.Infrastructure.Repositories;

public class EmailSubSampleRepository(ScsDbContext context, IHttpContextAccessor httpContext)
    : BaseRepository<EmailSubSample>(context, httpContext), IEmailSubSampleRepository
{
    private readonly ScsDbContext _context = context;
    public async Task<EmailSubSample?> GetByTypeAsync(EmailType emailType)
    {
        return await _context.EmailSubSamples.FirstOrDefaultAsync(e => e.EmailType == emailType);
    }

    public async Task<EmailSubSample?> GetByNamesAsync(string name)
    {
        return await _context.EmailSubSamples.FirstOrDefaultAsync(e => e.Name == name);
    }
}
