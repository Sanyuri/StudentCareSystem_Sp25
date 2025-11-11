namespace StudentCareSystem.Application.Commons.Models.AppSettings;

public class GetAppSettingDto
{
    public Guid Id { get; set; }
    public string? Value { get; set; }
    public string? Key { get; set; }
    public string VietnameseDescription { get; set; } = string.Empty;
    public string EnglishDescription { get; set; } = string.Empty;
    public string ParameterType { get; set; } = string.Empty;
}
