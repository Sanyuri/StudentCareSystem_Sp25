using StudentCareSystem.Domain.Enums;

namespace StudentCareSystem.Application.Commons.Models.EmailSubSamples;

public class EmailSubSampleFilter : PagingFilterBase
{
    public EmailType? EmailType { get; set; }
}
