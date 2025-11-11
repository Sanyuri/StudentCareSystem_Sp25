using StudentCareSystem.Domain.Entities;
using StudentCareSystem.Domain.Enums;

namespace StudentCareSystem.Domain.Interfaces;

public interface IEmailSampleRepository : IBaseRepository<EmailSample>
{
    Task<EmailSample?> GetByTypeAsync(EmailType emailType);
    Task<EmailSample?> GetEmailSampleWithSubSamplesAsync(EmailType emailType);
}
