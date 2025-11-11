namespace StudentCareSystem.Application.Commons.Models.ProgressCriteria;

public class UpdateProgressCriterionDto
{
    public Guid Id { get; set; }
    public Guid StudentNeedCareId { get; set; }
    public Guid ProgressCriterionTypeId { get; set; }
    public int Score { get; set; }
}
