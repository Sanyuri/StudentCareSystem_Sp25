namespace StudentCareSystem.Application.Commons.Models.Authentications;


public class SignAsRequest
{
    public Guid UserId { get; set; } = Guid.Empty;
    public string Otp { get; set; } = string.Empty;

}
