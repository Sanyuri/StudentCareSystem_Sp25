using System.ComponentModel.DataAnnotations.Schema;

using StudentCareSystem.Domain.Enums;
using StudentCareSystem.Domain.Interfaces;

namespace StudentCareSystem.Domain.Entities;

public class StudentDefer : BaseEntity<Guid>
{
    public string StudentCode { get; set; } = string.Empty;
    [Column(TypeName = "nvarchar(50)")]
    public StudentDeferStatus Status { get; set; }
    public string StudentDeferType { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public DateTime DefermentDate { get; set; }
    public string DeferredSemesterName { get; set; } = string.Empty;
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public virtual Student? Student { get; set; }
}

