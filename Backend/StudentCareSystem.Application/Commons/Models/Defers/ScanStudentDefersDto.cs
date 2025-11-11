using System.ComponentModel.DataAnnotations;

namespace StudentCareSystem.Application.Commons.Models.Defers;

public class ScanDeferRequest
{
    [Required]
    public string SemesterName { get; set; } = string.Empty;
}
