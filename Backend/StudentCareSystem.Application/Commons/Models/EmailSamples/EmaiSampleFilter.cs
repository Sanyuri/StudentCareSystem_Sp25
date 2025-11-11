using StudentCareSystem.Domain.Enums;

namespace StudentCareSystem.Application.Commons.Models.EmailSamples;

public class EmailSampleFilter : PagingFilterBase
{
    public string? Subject { get; set; } = string.Empty;
    public EmailType? EmailType { get; set; }
}
