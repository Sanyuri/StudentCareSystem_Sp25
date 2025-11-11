namespace StudentCareSystem.Application.Commons.Models.Attendances;

public class GetAttendanceHistoryDto
{
    public Guid Id { get; set; }
    public int OldTotalAbsences { get; set; }
    public int NewTotalAbsences { get; set; }
    public double OldAbsenceRate { get; set; }
    public double NewAbsenceRate { get; set; }
    public bool IsSendEmail { get; set; }
    public Guid StudentAttendanceId { get; set; }
    public DateTime CreatedAt { get; set; }
}
