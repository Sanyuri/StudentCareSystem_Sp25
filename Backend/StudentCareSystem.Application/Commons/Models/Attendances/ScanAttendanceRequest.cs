using System.ComponentModel.DataAnnotations;

namespace StudentCareSystem.Application.Commons.Models.Attendances;

public class ScanAttendanceRequest
{
    [Required]
    public string SemesterName { get; set; } = string.Empty;
}
