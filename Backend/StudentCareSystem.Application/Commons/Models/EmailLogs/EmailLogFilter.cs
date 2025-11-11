using StudentCareSystem.Domain.Enums;

namespace StudentCareSystem.Application.Commons.Models.EmailLogs;

public class EmailLogFilter : PagingFilterBase
{
    public string? SearchValue { get; set; }
    public EmailState? EmailState { get; set; }
    public string? SemesterName { get; set; }
    public EmailType? EmailType { get; set; }
    public DateTime? MinCreatedDate { get; set; }
    public DateTime? MaxCreatedDate { get; set; }
}
