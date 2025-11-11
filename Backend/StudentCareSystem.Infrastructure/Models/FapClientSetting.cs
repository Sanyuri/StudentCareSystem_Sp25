using System.ComponentModel.DataAnnotations;

namespace StudentCareSystem.Infrastructure.Models;

public class FapClientSetting
{
    [Required]
    public required string BaseAddress { get; set; }
    [Required]
    public required string ClientCode { get; set; }
    [Required]
    public required string HashCode { get; set; }
}

