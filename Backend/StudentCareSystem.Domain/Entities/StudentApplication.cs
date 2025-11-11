using System.ComponentModel.DataAnnotations.Schema;

using Microsoft.EntityFrameworkCore;

using StudentCareSystem.Domain.Enums;
using StudentCareSystem.Domain.Interfaces;


namespace StudentCareSystem.Domain.Entities;

[Index(nameof(StudentCode))]
[Index(nameof(CreatedAt))]
public class StudentApplication : BaseEntity<Guid>
{
    public string StudentCode { get; set; } = string.Empty;
    public DateTime? ReturnedDate { get; set; }
    [Column(TypeName = "nvarchar(10)")]
    public ApplicationStatus Status { get; set; }
    public Guid ApplicationTypeId { get; set; }
    [ForeignKey("ApplicationTypeId")]
    public virtual ApplicationType? ApplicationType { get; set; }
    public virtual Student? Student { get; set; }
}
