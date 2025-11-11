namespace StudentCareSystem.Application.Commons.Models.Otps;

public class EnableOtpResponse
{
    public string Secret { get; set; } = string.Empty;
    public string Uri { get; set; } = string.Empty;
}
