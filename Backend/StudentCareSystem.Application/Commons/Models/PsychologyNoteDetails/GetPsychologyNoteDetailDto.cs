using StudentCareSystem.Application.Commons.Models.PsychologyNoteTypes;

namespace StudentCareSystem.Application.Commons.Models.PsychologyNoteDetails;

public class GetPsychologyNoteDetailDto
{
    public Guid Id { get; set; }
    public Guid PsychologyNoteId { get; set; }
    public string Content { get; set; } = string.Empty;
    public GetPsychologyNoteTypeDto PsychologyNoteType { get; set; } = new();
}
