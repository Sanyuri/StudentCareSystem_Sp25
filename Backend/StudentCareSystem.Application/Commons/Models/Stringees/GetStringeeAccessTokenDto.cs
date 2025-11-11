namespace StudentCareSystem.Application.Commons.Models.Stringees;

public class GetStringeeAccessTokenDto
{
    public string AccessToken { get; set; } = string.Empty;
    public int ExpiresIn { get; set; }
    public string PhoneNumber { get; set; } = string.Empty;
}
