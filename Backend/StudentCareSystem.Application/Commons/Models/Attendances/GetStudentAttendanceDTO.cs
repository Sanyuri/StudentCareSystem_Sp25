using StudentCareSystem.Application.Commons.Models.Students;

namespace StudentCareSystem.Application.Commons.Models.Attendances;

public class GetStudentAttendanceDto
{
    public Guid Id { get; set; }
    public string StudentCode { get; set; } = string.Empty;
    public string? ClassName { get; set; }
    public string? SemesterName { get; set; }
    public int CurrentTermNo { get; set; }
    public DateTime UpdatedPeriod { get; set; }
    public string? SubjectCode { get; set; }
    public int? TotalAbsences { get; set; }
    public int? TotalSlots { get; set; }
    public double? AbsenceRate { get; set; }
    public bool IsIncreased { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public GetStudentDto? Student { get; set; }
}
