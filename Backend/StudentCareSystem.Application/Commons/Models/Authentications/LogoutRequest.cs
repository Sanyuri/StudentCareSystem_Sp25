using System.ComponentModel.DataAnnotations;

namespace StudentCareSystem.Application.Commons.Models.Authentications;

public class LogoutRequest
{
    [Required]
    public string RefreshToken { get; set; } = string.Empty;

}
