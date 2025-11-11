using System.ComponentModel.DataAnnotations;

namespace StudentCareSystem.Infrastructure.Models;

public class StringeeSettings
{
    [Required]
    public required string ClientId { get; set; }
    [Required]
    public required string ClientSecret { get; set; }
    [Required]
    public required int ExpiredTime { get; set; }

    public required string PhoneNumber { get; set; }
}
