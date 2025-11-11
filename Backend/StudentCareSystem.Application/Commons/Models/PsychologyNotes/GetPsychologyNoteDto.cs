using StudentCareSystem.Application.Commons.Models.PsychologyNoteDetails;

namespace StudentCareSystem.Application.Commons.Models.PsychologyNotes;

public class GetPsychologyNoteDto
{
    public Guid Id { get; set; }
    public Guid StudentPsychologyId { get; set; }
    public string? Subject { get; set; }
    public string SemesterName { get; set; } = string.Empty;
    public IEnumerable<GetPsychologyNoteDetailDto> PsychologyNoteDetails { get; set; } = [];
    public string CreatedBy { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public string UpdatedBy { get; set; } = string.Empty;
    public DateTime? UpdatedAt { get; set; }
    public string DriveURL { get; set; } = string.Empty;
}
