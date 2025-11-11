using System.ComponentModel.DataAnnotations;

namespace StudentCareSystem.Infrastructure.Models.AIs;

public class AISettings
{
    [Required]
    public string BaseAddress { get; set; } = string.Empty;
    [Required]
    public string Key { get; set; } = string.Empty;
}
