using StudentCareSystem.Application.Commons.Models.NoteTypes;
using StudentCareSystem.Application.Commons.Models.Students;

namespace StudentCareSystem.Application.Commons.Models.Notes;

public class GetStudentNoteDto
{
    public Guid Id { get; set; }
    public string Content { get; set; } = string.Empty;
    public GetNoteTypeDto NoteType { get; set; } = new GetNoteTypeDto();
    public GetStudentDto Student { get; set; } = new GetStudentDto();
    public string StudentCode { get; set; } = string.Empty;
    public string SemesterName { get; set; } = string.Empty;
    public string Channel { get; set; } = string.Empty;
    public string ProcessingTime { get; set; } = string.Empty;
    public Guid? EntityId { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public string CreatedBy { get; set; } = string.Empty;
    public string? UpdatedBy { get; set; }

}
