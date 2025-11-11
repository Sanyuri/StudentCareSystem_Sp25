using System.ComponentModel.DataAnnotations.Schema;

using Microsoft.EntityFrameworkCore;

using StudentCareSystem.Domain.Enums;
using StudentCareSystem.Domain.Interfaces;

namespace StudentCareSystem.Domain.Entities;

public class UserEmailLog : BaseEntity<Guid>
{
    public string Subject { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public string RecipientEmail { get; set; } = string.Empty;
    public string CcEmails { get; set; } = string.Empty;
    public string BccEmails { get; set; } = string.Empty;
    public string ReplyToEmail { get; set; } = string.Empty;
    [Column(TypeName = "nvarchar(50)")]
    public EmailType EmailType { get; set; }
    public string SemesterName { get; set; } = string.Empty;
    [Column(TypeName = "nvarchar(10)")]
    public EmailState EmailState { get; set; }
    public Guid IdentifierCode { get; set; }
    public string ProxyLogId { get; set; } = string.Empty;
    public string? ErrorMessage { get; set; }
}
