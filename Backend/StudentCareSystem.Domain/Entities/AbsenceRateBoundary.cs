using System.ComponentModel.DataAnnotations.Schema;

using StudentCareSystem.Domain.Interfaces;

namespace StudentCareSystem.Domain.Entities;

public class AbsenceRateBoundary : BaseEntity<Guid>
{
    public double MinAbsenceRate { get; set; }
    public double MaxAbsenceRate { get; set; }
    public Guid EmailSampleId { get; set; }
    [ForeignKey("EmailSampleId")]
    public virtual EmailSample? EmailSample { get; set; }
    public bool IsActive { get; set; }
}
