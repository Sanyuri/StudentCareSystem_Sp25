namespace StudentCareSystem.Application.Commons.Models.Attendances;

public class AttendanceFilter : PagingFilterBase
{
    public string? Query { get; set; }
    public int? TotalSlots { get; set; }
    public double? MinAbsenceRate { get; set; }
    public double? MaxAbsenceRate { get; set; }
    public DateTime? From { get; set; }
    public DateTime? To { get; set; }
    public string? ClassName { get; set; }
    public string? SubjectCode { get; set; }
    public int? TotalAbsences { get; set; }
    public int? CurrentTermNo { get; set; }
    public bool? IsIncreased { get; set; }
    public string? Major { get; set; }
}
