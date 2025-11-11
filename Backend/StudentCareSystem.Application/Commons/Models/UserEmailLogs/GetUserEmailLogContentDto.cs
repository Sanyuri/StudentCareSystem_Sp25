using StudentCareSystem.Application.Commons.Models.Users;

namespace StudentCareSystem.Application.Commons.Models.UserEmailLogs;

public class GetUserEmailLogDetailDto
{
    public Guid Id { get; set; }
    public string Content { get; set; } = string.Empty;
    public string Subject { get; set; } = string.Empty;
    public string EmailType { get; set; } = string.Empty;
    public string SemesterName { get; set; } = string.Empty;
    public string EmailState { get; set; } = string.Empty;
    public string RecipientEmail { get; set; } = string.Empty;
    public List<string> CcEmails { get; set; } = [];
    public List<string> BccEmails { get; set; } = [];
    public string ReplyToEmail { get; set; } = string.Empty;

}
