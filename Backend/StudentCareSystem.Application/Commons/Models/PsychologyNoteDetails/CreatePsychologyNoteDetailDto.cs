using System.ComponentModel.DataAnnotations;

namespace StudentCareSystem.Application.Commons.Models.PsychologyNoteDetails;

public class CreatePsychologyNoteDetailDto
{
    [Required]
    public string Content { get; set; } = string.Empty;
    [Required]
    public Guid PsychologyNoteTypeId { get; set; }
    public Guid? PsychologyNoteId { get; set; }
}
