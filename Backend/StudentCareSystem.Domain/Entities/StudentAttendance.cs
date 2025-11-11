using Microsoft.EntityFrameworkCore;

using StudentCareSystem.Domain.Interfaces;


namespace StudentCareSystem.Domain.Entities;

[Index(nameof(StudentCode))]
[Index(nameof(AbsenceRate))]
public class StudentAttendance : BaseEntity<Guid>
{
    public string StudentCode { get; set; } = string.Empty;
    public string ClassName { get; set; } = string.Empty;
    public string SemesterName { get; set; } = string.Empty;
    public string SubjectCode { get; set; } = string.Empty;
    public int TotalAbsences { get; set; }
    public int TotalSlots { get; set; }
    public double AbsenceRate { get; set; }
    public bool IsIncreased { get; set; }
    public bool SkipEmailOnAttendance { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public virtual Student? Student { get; set; }
    public virtual ICollection<AttendanceHistory> AttendanceHistories { get; set; } = [];
}

