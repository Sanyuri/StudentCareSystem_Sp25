using Microsoft.EntityFrameworkCore;

using StudentCareSystem.Domain.Interfaces;

namespace StudentCareSystem.Domain.Entities;

[Index(nameof(StudentCode))]
[Index(nameof(UserId))]
public class StudentPsychology : BaseEntity<Guid>
{
    public string StudentCode { get; set; } = string.Empty;
    public Guid UserId { get; set; }
    public string AccessPassword { get; set; } = string.Empty;
    public virtual Student? Student { get; set; }
    public virtual User? User { get; set; }
    public ICollection<PsychologyNote> PsychologyNotes { get; set; } = [];

}
