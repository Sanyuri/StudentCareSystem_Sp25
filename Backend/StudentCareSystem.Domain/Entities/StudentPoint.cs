using System.ComponentModel.DataAnnotations.Schema;

using Microsoft.EntityFrameworkCore;

using StudentCareSystem.Domain.Enums;
using StudentCareSystem.Domain.Interfaces;

namespace StudentCareSystem.Domain.Entities;

[Index(nameof(StudentCode))]
[Index(nameof(SubjectCode))]
public class StudentPoint : BaseEntity<Guid>
{
    public string StudentCode { get; set; } = string.Empty;
    public string SubjectCode { get; set; } = string.Empty;
    public double AverageMark { get; set; }
    public string ClassName { get; set; } = string.Empty;
    public bool IsExempt { get; set; }
    [Column(TypeName = "nvarchar(30)")]
    public FailReason FailReason { get; set; }
    [Column(TypeName = "nvarchar(30)")]
    public PointStatus PointStatus { get; set; }
    public string SemesterName { get; set; } = string.Empty;
    public bool IsPassWith { get; set; }
    public bool IsSendMail { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public virtual Student Student { get; set; } = null!;

}

