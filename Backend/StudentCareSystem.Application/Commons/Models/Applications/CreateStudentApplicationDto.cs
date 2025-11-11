using System.ComponentModel.DataAnnotations;

using StudentCareSystem.Domain.Enums;
using StudentCareSystem.Infrastructure.Attributes;

namespace StudentCareSystem.Application.Commons.Models.Applications;

public class CreateStudentApplicationDto
{
    [Required]
    public string StudentCode { get; set; } = string.Empty;
    [Required]
    public string EmailSubject { get; set; } = string.Empty;
    [Required]
    public ApplicationStatus Status { get; set; }
    [Required]
    public string EmailContent { get; set; } = string.Empty;
    [EmailListValidation]
    public List<string> CcEmails { get; set; } = [];
    [EmailListValidation]
    public List<string> BccEmails { get; set; } = [];
    [EmailAddress]
    public string ReplyToEmail { get; set; } = string.Empty;
    public DateTime? ReturnedDate { get; set; }
    [Required]
    public Guid ApplicationTypeId { get; set; }
}
