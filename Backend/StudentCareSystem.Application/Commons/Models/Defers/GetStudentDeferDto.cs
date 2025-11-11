using StudentCareSystem.Application.Commons.Models.Students;

namespace StudentCareSystem.Application.Commons.Models.Defers;

public class GetStudentDeferDto
{
    public Guid Id { get; set; }
    public string StudentCode { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string StudentDeferType { get; set; } = string.Empty;
    public DateTime DefermentDate { get; set; }
    public string DeferredSemesterName { get; set; } = string.Empty;
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public DateTime UpdatedAt { get; set; }
    public GetStudentDto? Student { get; set; }
}
