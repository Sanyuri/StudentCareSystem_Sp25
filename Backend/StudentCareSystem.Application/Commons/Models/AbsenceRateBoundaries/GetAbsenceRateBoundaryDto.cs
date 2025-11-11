using StudentCareSystem.Application.Commons.Models.EmailSamples;

namespace StudentCareSystem.Application.Commons.Models.AbsenceRateBoundaries;

public class GetAbsenceRateBoundaryDto
{
    public Guid Id { get; set; }
    public double MinAbsenceRate { get; set; }
    public double MaxAbsenceRate { get; set; }
    public GetEmailSampleDto? EmailSample { get; set; }
    public bool IsActive { get; set; }
}
