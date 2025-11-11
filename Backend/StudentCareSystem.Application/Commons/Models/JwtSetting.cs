using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace StudentCareSystem.Application.Commons.Models;

public class JwtSetting
{
    [JsonPropertyName("secret")]
    [Required]
    public string Secret { get; set; } = string.Empty;

    [JsonPropertyName("issuer")]
    [Required]
    public string Issuer { get; set; } = string.Empty;

    [JsonPropertyName("audience")]
    [Required]
    public string Audience { get; set; } = string.Empty;

    [JsonPropertyName("accessTokenExpiration")]
    [Required]
    public long AccessTokenExpiration { get; set; }

    [JsonPropertyName("refreshTokenExpiration")]
    [Required]
    public long RefreshTokenExpiration { get; set; }
    public bool ValidateIssuer { get; set; }
    public bool ValidateAudience { get; set; }
    public bool ValidateLifetime { get; set; }
    public bool ValidateIssuerSigningKey { get; set; }
}
