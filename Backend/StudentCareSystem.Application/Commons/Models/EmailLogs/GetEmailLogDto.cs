using StudentCareSystem.Application.Commons.Models.Students;

namespace StudentCareSystem.Application.Commons.Models.EmailLogs;

public class GetEmailLogDto
{
    public Guid Id { get; set; }
    public string Subject { get; set; } = string.Empty;
    public string EmailType { get; set; } = string.Empty;
    public string StudentCode { get; set; } = string.Empty;
    public string RecipientEmail { get; set; } = string.Empty;
    public string SemesterName { get; set; } = string.Empty;
    public string EmailState { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public string CreatedBy { get; set; } = string.Empty;
    public GetStudentDto Student { get; set; } = new();
}
