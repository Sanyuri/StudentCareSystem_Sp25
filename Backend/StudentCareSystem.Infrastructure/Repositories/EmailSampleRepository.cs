using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

using StudentCareSystem.Domain.Entities;
using StudentCareSystem.Domain.Enums;
using StudentCareSystem.Domain.Interfaces;
using StudentCareSystem.Infrastructure.Data;
using StudentCareSystem.Infrastructure.Utilities;

namespace StudentCareSystem.Infrastructure.Repositories;

public class EmailSampleRepository(ScsDbContext context, IHttpContextAccessor httpContext)
    : BaseRepository<EmailSample>(context, httpContext), IEmailSampleRepository
{
    private readonly ScsDbContext _context = context;
    public async Task<EmailSample?> GetByTypeAsync(EmailType emailType)
    {
        return await _context.EmailSamples.FirstOrDefaultAsync(e => e.EmailType == emailType);
    }

    public async Task<EmailSample?> GetEmailSampleWithSubSamplesAsync(EmailType emailType)
    {
        var result = await _context.EmailSamples
            .AsNoTracking()
            .FirstOrDefaultAsync(e => e.EmailType == emailType);

        if (result != null)
        {
            var emailSubSampleNames = StringListConverter.ConvertStringToList(result.EmailSubSampleList);

            var emailSubSamples = await _context.EmailSubSamples
                .Where(e => emailSubSampleNames.Contains(e.Name))
                .AsNoTracking()
                .ToListAsync();

            result.EmailSubSamples = emailSubSamples;
        }

        return result;
    }
}
