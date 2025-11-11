using StudentCareSystem.Domain.Interfaces;

namespace StudentCareSystem.Domain.Entities;

/// <summary>
/// Represents a semester in the student care system.
/// </summary>
public class Semester : BaseEntity<Guid>
{
    public string SemesterName { get; set; } = string.Empty;
    public bool IsCurrentSemester { get; set; }
    public DateTime EndDate { get; set; }
    public DateTime StartDate { get; set; }
}

