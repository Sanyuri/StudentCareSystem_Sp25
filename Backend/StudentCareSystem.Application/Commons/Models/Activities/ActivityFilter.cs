using StudentCareSystem.Domain.Enums;

namespace StudentCareSystem.Application.Commons.Models.Activities;

public class ActivityFilter : PagingFilterBase
{
    public string? Email { get; set; } = string.Empty;
    public DateTime? FromDate { get; set; }
    public DateTime? ToDate { get; set; }
    public ActivityType? ActivityType { get; set; }
}
