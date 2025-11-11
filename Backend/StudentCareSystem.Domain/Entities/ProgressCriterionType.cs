using StudentCareSystem.Domain.Interfaces;

namespace StudentCareSystem.Domain.Entities;

public class ProgressCriterionType : BaseEntity<Guid>
{
    public string EnglishName { get; set; } = string.Empty;
    public string VietnameseName { get; set; } = string.Empty;
    public string VietnameseDescription { get; set; } = string.Empty;
    public string EnglishDescription { get; set; } = string.Empty;
    public ICollection<ProgressCriterion> ProgressCriteria { get; set; } = [];
}
