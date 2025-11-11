using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

using Microsoft.IdentityModel.Tokens;

using OtpNet;

using StudentCareSystem.Application.Commons.Models;

namespace StudentCareSystem.Application.Commons.Utilities;

public static class TokenHelper
{
    /// <summary>
    /// Generates a JWT access token.
    /// </summary>
    /// <param name="claims">The claims to include in the token.</param>
    /// <param name="jwtSetting">The JWT settings.</param>
    /// <returns>The generated JWT token as a string.</returns>
    public static string GenerateAccessToken(List<Claim> claims, JwtSetting jwtSetting)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSetting.Secret));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var token = new JwtSecurityToken(
            jwtSetting.Issuer,
            jwtSetting.Audience,
            claims,
            expires: DateTime.Now.AddMilliseconds(jwtSetting.AccessTokenExpiration),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    /// <summary>
    /// Validates a JWT token.
    /// </summary>
    /// <param name="token">The JWT token to validate.</param>
    /// <param name="jwtSetting">The JWT settings.</param>
    /// <returns>The claims principal if the token is valid; otherwise, null.</returns>
    public static ClaimsPrincipal? ValidateToken(string token, JwtSetting jwtSetting)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.ASCII.GetBytes(jwtSetting.Secret);
        var validationParameters = new TokenValidationParameters
        {
            ValidateIssuer = jwtSetting.ValidateIssuer,
            ValidateAudience = jwtSetting.ValidateAudience,
            ValidateLifetime = jwtSetting.ValidateLifetime,
            ValidateIssuerSigningKey = jwtSetting.ValidateIssuerSigningKey,
            ValidIssuer = jwtSetting.Issuer,
            ValidAudience = jwtSetting.Audience,
            IssuerSigningKey = new SymmetricSecurityKey(key)
        };

        try
        {
            var principal = tokenHandler.ValidateToken(token, validationParameters, out var _);
            return principal;
        }
        catch
        {
            return null;
        }
    }

    public static string GenerateRefreshToken()
    {
        return Convert.ToBase64String(RandomNumberGenerator.GetBytes(64));
    }

    /// <summary>
    /// Generates an access token for Stringee API
    /// </summary>
    /// <param name="keySid">The key SID</param>
    /// <param name="keySecret">The key secret</param>
    /// <param name="expireInSecond">Token expiration time in seconds</param>
    /// <returns>The generated JWT token as a string, or null if generation fails</returns>
    public static string? GenerateStringeeAccessToken(string keySid, string keySecret, int expireInSecond, string? userId)
    {
        try
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(keySecret));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var header = new JwtHeader(credentials)
            {
                { "typ", "JWT" },
                { "alg", "HS256" },
                { "cty", "stringee-api;v=1" }
            };

            var expiration = DateTime.UtcNow.AddSeconds(expireInSecond);
            var jti = $"{keySid}-{DateTimeOffset.UtcNow.ToUnixTimeMilliseconds()}";

            var payload = new JwtPayload
            {
                { "jti", jti },
                { "iss", keySid },
                { "rest_api", true },
                { "exp", new DateTimeOffset(expiration).ToUnixTimeSeconds() },
                { "user_id", userId }
            };

            var token = new JwtSecurityToken(header, payload);
            return new JwtSecurityTokenHandler().WriteToken(token);
        }
        catch
        {
            return null;
        }
    }


}
