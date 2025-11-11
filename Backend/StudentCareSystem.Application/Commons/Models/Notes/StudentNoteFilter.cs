using StudentCareSystem.Domain.Enums;
using StudentCareSystem.Application.Commons.Models;

namespace StudentCareSystem.Application.Commons.Models.Notes;

public class StudentNoteFilter : PagingFilterBase
{
    public string? Query { get; set; }
    public Guid? NoteTypeId { get; set; }
    public DateTime? FromDate { get; set; }
    public DateTime? ToDate { get; set; }
    public string? SemesterName { get; set; }
}
