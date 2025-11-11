using System.ComponentModel.DataAnnotations;

namespace StudentCareSystem.Infrastructure.Models;

public class HangfireSetting
{
    [Required]
    public string Username { get; set; } = string.Empty;
    [Required]
    public string Password { get; set; } = string.Empty;
}
