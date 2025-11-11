using System.ComponentModel.DataAnnotations;

namespace StudentCareSystem.Infrastructure.Models;

public class GoogleSetting
{
    [Required]
    public required string ClientId { get; set; }
    [Required]
    public required string ClientSecret { get; set; }
}
