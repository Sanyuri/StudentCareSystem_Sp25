using StudentCareSystem.Domain.Enums;

namespace StudentCareSystem.Application.Commons.Models.EmailSamples;

public class GetEmailSampleDto
{
    public Guid Id { get; set; }
    public string Subject { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public string EmailType { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public List<string> CcEmails { get; set; } = [];
    public List<string> BccEmails { get; set; } = [];
    public string ReplyToEmail { get; set; } = string.Empty;
    public bool IsSystemEmail { get; set; }
}
