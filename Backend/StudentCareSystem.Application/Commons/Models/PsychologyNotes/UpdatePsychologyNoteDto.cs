using System.ComponentModel.DataAnnotations;

using StudentCareSystem.Application.Commons.Models.PsychologyNoteDetails;

namespace StudentCareSystem.Application.Commons.Models.PsychologyNotes;

public class UpdatePsychologyNoteDto
{
    [Required]
    public Guid Id { get; set; }
    public IEnumerable<UpdatePsychologyNoteDetailDto> PsychologyNoteDetails { get; set; } = [];
    public string? Subject { get; set; }
}
