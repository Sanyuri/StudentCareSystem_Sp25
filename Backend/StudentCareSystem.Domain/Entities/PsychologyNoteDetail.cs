using Microsoft.EntityFrameworkCore;

using StudentCareSystem.Domain.Interfaces;

namespace StudentCareSystem.Domain.Entities;

[Index(nameof(PsychologyNoteId))]
public class PsychologyNoteDetail : BaseEntity<Guid>
{
    public string Content { get; set; } = string.Empty;
    public Guid PsychologyNoteTypeId { get; set; }
    public virtual PsychologyNoteType? PsychologyNoteType { get; set; }
    public Guid PsychologyNoteId { get; set; }
    public virtual PsychologyNote? PsychologyNote { get; set; }

}
