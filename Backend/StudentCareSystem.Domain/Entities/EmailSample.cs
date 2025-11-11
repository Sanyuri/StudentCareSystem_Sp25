using System.ComponentModel.DataAnnotations.Schema;

using StudentCareSystem.Domain.Enums;
using StudentCareSystem.Domain.Interfaces;

namespace StudentCareSystem.Domain.Entities;

public class EmailSample : BaseEntity<Guid>
{
    public string Subject { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public string CcEmails { get; set; } = string.Empty;
    public string BccEmails { get; set; } = string.Empty;
    public string ReplyToEmail { get; set; } = string.Empty;
    [Column(TypeName = "nvarchar(50)")]
    public EmailType EmailType { get; set; }
    public string EmailSubSampleList { get; set; } = string.Empty;
    public bool IsSystemEmail { get; set; }
    public virtual ICollection<AbsenceRateBoundary> AbsenceRateBoundaries { get; set; } = [];
    [NotMapped]
    public virtual List<EmailSubSample> EmailSubSamples { get; set; } = [];
}

