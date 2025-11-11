namespace StudentCareSystem.Application.Commons.Models.EmailSubSamples;

public class GetEmailSubSampleDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string VietnameseDescription { get; set; } = string.Empty;
    public string EnglishDescription { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public string EmailType { get; set; } = string.Empty;
}

