namespace StudentCareSystem.Application.Commons.Models.AbsenceRateBoundaries;

public class UpdateAbsenceRateBoundaryDto
{
    public Guid Id { get; set; }
    public double MinAbsenceRate { get; set; }
    public double MaxAbsenceRate { get; set; }
    public Guid EmailSampleId { get; set; }
    public bool IsActive { get; set; }
}
