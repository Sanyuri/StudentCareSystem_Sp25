using System.ComponentModel.DataAnnotations;

namespace StudentCareSystem.Application.Commons.Models.Notes;

public class ImportStudentNoteDto
{
    [Required]
    public string StudentCode { get; set; } = string.Empty;
    [Required]
    public string Content { get; set; } = string.Empty;
    [Required]
    public Guid NoteTypeId { get; set; }
    public string? Channel { get; set; } = string.Empty;
    public string? ProcessingTime { get; set; } = string.Empty;
    [Required]
    public string SemesterName { get; set; } = string.Empty;
    [Required]
    public string CreatedBy { get; set; } = string.Empty;
}
