using System.ComponentModel.DataAnnotations;

namespace StudentCareSystem.Application.Commons.Models.Authentications;

public class GoogleAuthRequest
{
    [Required]
    public string Code { get; set; } = string.Empty;
    [Required]
    public string CampusCode { get; set; } = string.Empty;
}
