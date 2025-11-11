using System.ComponentModel.DataAnnotations.Schema;

using Microsoft.EntityFrameworkCore;

using StudentCareSystem.Domain.Interfaces;

namespace StudentCareSystem.Domain.Entities;

[Index(nameof(StudentAttendanceId))]
public class AttendanceHistory : BaseEntity<Guid>
{
    public int OldTotalAbsences { get; set; }
    public int NewTotalAbsences { get; set; }
    public double OldAbsenceRate { get; set; }
    public double NewAbsenceRate { get; set; }
    public bool IsSendEmail { get; set; }
    public Guid StudentAttendanceId { get; set; }
    [ForeignKey("StudentAttendanceId")]
    public virtual StudentAttendance StudentAttendance { get; set; } = new();
}
