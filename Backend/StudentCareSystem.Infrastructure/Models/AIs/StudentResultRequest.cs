namespace StudentCareSystem.Infrastructure.Models.AIs;

public class StudentResultRequest
{
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 10;
    public string? Query { get; set; }
    public bool OrderByTopsisScore { get; set; } = true;
    public string[] IgnoredStatusCodes { get; set; } = [];
    public string[] StatusCodes { get; set; } = [];
    public required string SemesterName { get; set; }
    public int? MinGpaGap { get; set; } = null;
    public int? MaxGpaGap { get; set; } = null;
    public double? MinAbsenceRate { get; set; } = null;
    public double? MaxAbsenceRate { get; set; } = null;
    public int? MinFailSubjects { get; set; } = null;
    public int? MaxFailSubjects { get; set; } = null;
    public int? MinCurrentTermNo { get; set; } = null;
    public int? MaxCurrentTermNo { get; set; } = null;
    public bool IsAttendanceExempted { get; set; } = false;
    public string[] IgnoredStudentCodes { get; set; } = [];
}
