using System.ComponentModel.DataAnnotations;

using StudentCareSystem.Domain.Enums;

namespace StudentCareSystem.Application.Commons.Models.AppSettings;

public class CreateAppSettingDto
{
    [Required]
    [MinLength(1)]
    public string Key { get; set; } = string.Empty;
    public string? Value { get; set; }
    public string VietnameseDescription { get; set; } = string.Empty;
    public string EnglishDescription { get; set; } = string.Empty;
    public ParameterType ParameterType { get; set; }
}
