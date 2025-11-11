namespace StudentCareSystem.Application.Commons.Models.ProgressCriteria;

public class CreateProgressCriterionDto
{
    public Guid StudentNeedCareId { get; set; }
    public int Score { get; set; }
    public Guid ProgressCriterionTypeId { get; set; }
}
