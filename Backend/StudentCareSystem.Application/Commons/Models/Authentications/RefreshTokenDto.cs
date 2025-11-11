using System.ComponentModel.DataAnnotations;

namespace StudentCareSystem.Application.Commons.Models.Authentications;

public class RefreshTokenDto
{
    [Required]
    public string AccessToken { get; set; } = string.Empty;
    [Required]
    public string RefreshToken { get; set; } = string.Empty;
}
