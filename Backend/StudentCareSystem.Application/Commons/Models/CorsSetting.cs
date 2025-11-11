using System.ComponentModel.DataAnnotations;

namespace StudentCareSystem.Application.Commons.Models;

public class CorsSetting
{
    [Required(ErrorMessage = "AllowedOrigins is required")]
    public string[] AllowedOrigins { get; set; } = [];
    public string[] AllowedMethods { get; set; } = [];
    public string[] AllowedHeaders { get; set; } = [];
    public bool AllowCredentials { get; set; }
    public int PreflightMaxAge { get; set; }
}
