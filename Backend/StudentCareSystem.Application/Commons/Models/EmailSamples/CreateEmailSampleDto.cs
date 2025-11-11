using System.ComponentModel.DataAnnotations;

using StudentCareSystem.Domain.Enums;
using StudentCareSystem.Infrastructure.Attributes;

namespace StudentCareSystem.Application.Commons.Models.EmailSamples;

public class CreateEmailSampleDto
{
    [Required]
    [MinLength(1)]
    public string Subject { get; set; } = string.Empty;
    [Required]
    [MinLength(1)]
    public string Content { get; set; } = string.Empty;
    public EmailType EmailType { get; set; }
    [EmailListValidation]
    public List<string> CcEmails { get; set; } = [];
    [EmailListValidation]
    public List<string> BccEmails { get; set; } = [];
    [EmailAddress]
    public string ReplyToEmail { get; set; } = string.Empty;
}
