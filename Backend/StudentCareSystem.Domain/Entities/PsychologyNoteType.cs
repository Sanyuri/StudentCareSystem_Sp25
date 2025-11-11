using StudentCareSystem.Domain.Interfaces;

namespace StudentCareSystem.Domain.Entities;

public class PsychologyNoteType : BaseEntity<Guid>
{
    public string EnglishName { get; set; } = string.Empty;
    public string VietnameseName { get; set; } = string.Empty;
    public ICollection<PsychologyNoteDetail> PsychologyNoteDetails { get; set; } = [];
}
