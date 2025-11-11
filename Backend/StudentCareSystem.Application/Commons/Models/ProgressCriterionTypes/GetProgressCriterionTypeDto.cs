namespace StudentCareSystem.Application.Commons.Models.ProgressCriterionTypes;

public class GetProgressCriterionTypeDto
{
    public Guid Id { get; set; }
    public string VietnameseName { get; set; } = string.Empty;
    public string EnglishName { get; set; } = string.Empty;
    public string VietnameseDescription { get; set; } = string.Empty;
    public string EnglishDescription { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}
