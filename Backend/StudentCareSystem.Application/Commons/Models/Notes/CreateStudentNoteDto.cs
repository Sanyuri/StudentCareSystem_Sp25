using System.ComponentModel.DataAnnotations;

namespace StudentCareSystem.Application.Commons.Models.Notes;

public class CreateStudentNoteDto
{
    [Required]
    [MinLength(1)]
    public string Content { get; set; } = string.Empty;
    [Required]
    public Guid NoteTypeId { get; set; }
    public Guid? EntityId { get; set; }
    public string? Channel { get; set; } = string.Empty;
    public string? ProcessingTime { get; set; } = string.Empty;
    [Required]
    public string StudentCode { get; set; } = string.Empty;
}
