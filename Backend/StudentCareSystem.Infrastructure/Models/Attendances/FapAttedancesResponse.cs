namespace StudentCareSystem.Infrastructure.Models.Attendances;

public class FapStudentAttendanceData
{
    public string? Email { get; set; }
    public string? FullName { get; set; }
    public string Subject { get; set; } = string.Empty;
    public string RollNumber { get; set; } = string.Empty;
    public string? ClassName { get; set; }
    public int TotalAbsences { get; set; }
    public int TotalSlots { get; set; }
    public double AbsenceRate { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
}
