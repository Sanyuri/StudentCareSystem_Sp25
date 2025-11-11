using StudentCareSystem.Domain.Entities;
using StudentCareSystem.Domain.Enums;

namespace StudentCareSystem.Domain.Interfaces;

public interface IEmailSubSampleRepository : IBaseRepository<EmailSubSample>
{
    Task<EmailSubSample?> GetByTypeAsync(EmailType emailType);
    Task<EmailSubSample?> GetByNamesAsync(string name);
}
