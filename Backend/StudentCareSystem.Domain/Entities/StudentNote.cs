using Microsoft.EntityFrameworkCore;

using StudentCareSystem.Domain.Interfaces;

namespace StudentCareSystem.Domain.Entities;

[Index(nameof(EntityId))]
[Index(nameof(StudentCode))]
public class StudentNote : BaseEntity<Guid>
{
    public string Content { get; set; } = string.Empty;
    public string StudentCode { get; set; } = string.Empty;
    public string SemesterName { get; set; } = string.Empty;
    public string Channel { get; set; } = string.Empty;
    public string ProcessingTime { get; set; } = string.Empty;
    public Guid NoteTypeId { get; set; }
    public Guid? EntityId { get; set; }
    public bool IsDeletable { get; set; }
    public virtual Student? Student { get; set; }
    public virtual NoteType? NoteType { get; set; }

}
