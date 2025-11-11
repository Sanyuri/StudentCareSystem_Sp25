namespace StudentCareSystem.Application.Commons.Models.AppSettings;

public class UpdateAppSettingDto
{
    public Guid Id { get; set; }
    public string? Value { get; set; }
    public string Key { get; set; } = string.Empty;
    public string VietnameseDescription { get; set; } = string.Empty;
    public string EnglishDescription { get; set; } = string.Empty;
    public string ParameterType { get; set; } = string.Empty;
}
