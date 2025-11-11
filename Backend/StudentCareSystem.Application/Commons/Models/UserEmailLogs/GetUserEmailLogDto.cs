using StudentCareSystem.Application.Commons.Models.Users;

namespace StudentCareSystem.Application.Commons.Models.UserEmailLogs;

public class GetUserEmailLogDto
{
    public Guid Id { get; set; }
    public string Subject { get; set; } = string.Empty;
    public string EmailType { get; set; } = string.Empty;
    public string? StudentCode { get; set; }
    public string RecipientEmail { get; set; } = string.Empty;
    public string SemesterName { get; set; } = string.Empty;
    public string EmailState { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public string CreatedBy { get; set; } = string.Empty;
}
