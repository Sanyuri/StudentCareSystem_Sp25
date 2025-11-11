namespace StudentCareSystem.Application.Commons.Models.ProgressCriteria;


public class GetProgressCriterionDto
{
    public Guid Id { get; set; }
    public int Score { get; set; }
    public Guid ProgressCriterionTypeId { get; set; }
}
