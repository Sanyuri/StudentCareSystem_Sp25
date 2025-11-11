using StudentCareSystem.Application.Commons.Models.Students;
using StudentCareSystem.Domain.Enums;

namespace StudentCareSystem.Application.Commons.Models.Points;

public class GetStudentPointDto
{
    public Guid Id { get; set; }
    public string StudentCode { get; set; } = string.Empty;
    public string SubjectCode { get; set; } = string.Empty;
    public double AverageMark { get; set; }
    public string ClassName { get; set; } = string.Empty;
    public bool IsExempt { get; set; }
    // Expose domain enums present on the entity
    public FailReason FailReason { get; set; }
    public PointStatus PointStatus { get; set; }
    public string SemesterName { get; set; } = string.Empty;
    public bool IsPassWith { get; set; }
    public bool IsSendMail { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public GetStudentDto? Student { get; set; }
    public DateTime UpdatedAt { get; set; }
}
