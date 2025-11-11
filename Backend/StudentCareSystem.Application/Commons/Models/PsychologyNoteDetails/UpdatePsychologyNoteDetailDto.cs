using System.ComponentModel.DataAnnotations;

namespace StudentCareSystem.Application.Commons.Models.PsychologyNoteDetails;

public class UpdatePsychologyNoteDetailDto
{
    [Required]
    public Guid Id { get; set; }
    [Required]
    public string Content { get; set; } = string.Empty;
    [Required]
    public Guid PsychologyNoteTypeId { get; set; }
}
