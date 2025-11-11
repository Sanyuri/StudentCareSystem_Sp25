namespace StudentCareSystem.Application.Commons.Models.Authentications;

public class AuthResponse
{
    public string? JwtToken { get; set; }
    public string? Role { get; set; }
    public string? RefreshToken { get; set; }
    public string? CampusCode { get; set; }
    public string? Email { get; set; }
    public string? Name { get; set; }
    public string? Image { get; set; }
    public bool? IsImpersonation { get; set; }
}
