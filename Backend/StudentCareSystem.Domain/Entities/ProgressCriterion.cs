using System.ComponentModel.DataAnnotations.Schema;

using StudentCareSystem.Domain.Interfaces;

namespace StudentCareSystem.Domain.Entities;

public class ProgressCriterion : BaseEntity<Guid>
{
    public Guid StudentNeedCareId { get; set; }
    public Guid ProgressCriterionTypeId { get; set; }
    public double? Score { get; set; }
    [ForeignKey("ProgressCriterionTypeId")]
    public virtual ProgressCriterionType? ProgressCriterionType { get; set; }
    [ForeignKey("StudentNeedCareId")]
    public virtual StudentNeedCare? StudentNeedCare { get; set; }
}
