using System.ComponentModel.DataAnnotations;

using StudentCareSystem.Domain.Enums;

namespace StudentCareSystem.Application.Commons.Models.EmailSubSamples;

public class UpdateEmailSubSampleDto
{
    public Guid Id { get; set; }
    [Required]
    public string Name { get; set; } = string.Empty;
    [Required]
    public string Content { get; set; } = string.Empty;
    public string VietnameseDescription { get; set; } = string.Empty;
    public string EnglishDescription { get; set; } = string.Empty;
    [Required]
    public EmailType EmailType { get; set; }
}
