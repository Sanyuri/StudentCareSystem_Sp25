namespace StudentCareSystem.Application.Commons.Models.ApplicationTypes;

public class ApplicationTypeResponse
{
    public Guid Id { get; set; }
    public string EnglishName { get; set; } = string.Empty;
    public string VietnameseName { get; set; } = string.Empty;
    public int TotalApplications { get; set; }
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}
