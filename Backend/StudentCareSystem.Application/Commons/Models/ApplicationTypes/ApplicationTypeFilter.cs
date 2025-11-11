namespace StudentCareSystem.Application.Commons.Models.ApplicationTypes;

public class ApplicationTypeFilter : PagingFilterBase
{
    public string? Subject { get; set; } = string.Empty;
}
