using System.ComponentModel.DataAnnotations;

namespace StudentCareSystem.Application.Commons.Models.Notes;

public class UpdateStudentNoteDto
{
    [Required]
    public Guid Id { get; set; }
    [Required]
    [MinLength(1)]
    public string Content { get; set; } = string.Empty;
    [Required]
    public Guid NoteTypeId { get; set; }
    public Guid? EntityId { get; set; }
    public string? Channel { get; set; } = string.Empty;
    public string? ProcessingTime { get; set; } = string.Empty;
}
