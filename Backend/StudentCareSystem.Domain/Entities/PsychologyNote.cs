using Microsoft.EntityFrameworkCore;

using StudentCareSystem.Domain.Interfaces;

namespace StudentCareSystem.Domain.Entities;

[Index(nameof(StudentPsychologyId))]
public class PsychologyNote : BaseEntity<Guid>
{
    public string Subject { get; set; } = string.Empty;
    public Guid StudentPsychologyId { get; set; }
    public string SemesterName { get; set; } = string.Empty;
    public string DriveURL { get; set; } = string.Empty;
    public virtual StudentPsychology? StudentPsychology { get; set; }
    public virtual ICollection<PsychologyNoteDetail> PsychologyNoteDetails { get; set; } = [];
}
