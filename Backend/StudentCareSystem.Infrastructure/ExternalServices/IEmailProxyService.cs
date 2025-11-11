using StudentCareSystem.Domain.Entities;
using StudentCareSystem.Infrastructure.Models.EmailProxies;

namespace StudentCareSystem.Infrastructure.ExternalServices;

public interface IEmailProxyService
{
    Task SendEmailAsync(
        string subject,
        string content,
        List<string> recipientEmails,
        List<string> ccEmails,
        List<string> bccEmails,
        string replyToEmail,
        EmailLog emailLog
    );
    Task SendEmailAsync(
        List<string> recipientEmails,
        string content,
        string subject,
        EmailSample emailSample,
        EmailLog emailLog
    );
    Task<IEnumerable<EmailProxyLog>?> GetEmailLogsByDateRangeAsync(DateTime from, DateTime to);
    Task<IEnumerable<EmailProxyLog>?> GetEmailLogsByIdentifierCodeAsync(List<Guid> identifierCodes);
    Task SendEmailAgainAsync(string emailId);
}
