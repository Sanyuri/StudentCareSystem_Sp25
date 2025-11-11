namespace StudentCareSystem.Infrastructure.Models.StudentPoints;

public class FapStudentPoint
{
    public string RollNumber { get; set; } = string.Empty;
    public string SubjectCode { get; set; } = string.Empty;
    public bool Status { get; set; }
    public double? AverageMark { get; set; }
    public bool IsExempt { get; set; }
    public bool IsSuspended { get; set; }
    public string SubjectName { get; set; } = string.Empty;
    public string ClassName { get; set; } = string.Empty;
    public bool IsAttendanceFail { get; set; }
    public string SemesterName { get; set; } = string.Empty;
    public bool IsPassWith { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
}
