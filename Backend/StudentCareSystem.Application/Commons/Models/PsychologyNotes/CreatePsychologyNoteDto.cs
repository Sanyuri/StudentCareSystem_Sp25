using StudentCareSystem.Application.Commons.Models.PsychologyNoteDetails;

namespace StudentCareSystem.Application.Commons.Models.PsychologyNotes;

public class CreatePsychologyNoteDto
{
    public Guid StudentPsychologyId { get; set; }
    public IEnumerable<CreatePsychologyNoteDetailDto> PsychologyNoteDetails { get; set; } = [];
    public string? Subject { get; set; }
}
