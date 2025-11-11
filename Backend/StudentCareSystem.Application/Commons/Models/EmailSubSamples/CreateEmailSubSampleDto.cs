using StudentCareSystem.Domain.Enums;

namespace StudentCareSystem.Application.Commons.Models.EmailSubSamples;

public class CreateEmailSubSampleDto
{
    public string Name { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public string VietnameseDescription { get; set; } = string.Empty;
    public string EnglishDescription { get; set; } = string.Empty;
    public EmailType EmailType { get; set; }
}
