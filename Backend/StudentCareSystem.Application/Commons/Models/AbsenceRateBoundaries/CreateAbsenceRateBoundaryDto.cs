using System.ComponentModel.DataAnnotations;

namespace StudentCareSystem.Application.Commons.Models.AbsenceRateBoundaries;

public class CreateAbsenceRateBoundaryDto
{
    [Required]
    [Range(0, 100)]
    public double MinAbsenceRate { get; set; }
    [Required]
    [Range(0, 100)]
    public double MaxAbsenceRate { get; set; }
    [Required]
    public Guid EmailSampleId { get; set; }
    [Required]
    public bool IsActive { get; set; }
}
