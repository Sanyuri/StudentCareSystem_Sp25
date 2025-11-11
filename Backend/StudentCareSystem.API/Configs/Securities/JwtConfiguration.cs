using System.Text;
using System.Text.Json;

using Finbuckle.MultiTenant;

using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;

using StudentCareSystem.Application.Commons.Models;
using StudentCareSystem.Application.Commons.Models.Apis;
using StudentCareSystem.Domain.Constants;
using StudentCareSystem.Infrastructure.Models;
using StudentCareSystem.Infrastructure.Models.Tenant;
using StudentCareSystem.Infrastructure.Utilities;

namespace StudentCareSystem.API.Configs.Securities;
public static class JwtConfiguration
{
    /// <summary>
    /// Configures JwtBearer
    /// </summary>
    /// <param name="services"></param>
    /// <param name="configuration"></param>
    public static void ConfigureJwtBearer(this IServiceCollection services, IConfiguration configuration)
    {
        var jwtSettings = configuration.GetSection("Jwt").Get<JwtSetting>();
        var googleSettings = configuration.GetSection("GoogleSettings").Get<GoogleSetting>();

        // Configure JwtBearer
        _ = services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme; // Ensure JWT is the default scheme
            })
            .AddJwtBearer(options =>
            {
                if (jwtSettings != null)
                {
                    ConfigurationJwtOptions(options, jwtSettings);
                }
            })
            .AddGoogle(options =>
            {
                ConfigureGoogleOptions(options, googleSettings);
            });
    }

    private static void ConfigurationJwtOptions(JwtBearerOptions options, JwtSetting jwtSettings)
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateActor = false,
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidAudience = jwtSettings.Audience,
            ValidIssuer = jwtSettings.Issuer,

            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ClockSkew = TimeSpan.Zero,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings.Secret))
        };

        // Prevent automatic token refresh by disabling any remote endpoint calls
        options.Events = new JwtBearerEvents
        {
            OnMessageReceived = context =>
            {
                // Custom logic to prevent refreshing tokens or making external calls
                var accessToken = context.Request.Headers.Authorization.FirstOrDefault()?.Split(" ").Last();
                if (!string.IsNullOrEmpty(accessToken))
                {
                    context.Token = accessToken;
                }
                return Task.CompletedTask;
            },
            OnChallenge = ConfigureJwtChallenge,
            //Custom logic to handle multiple tenants
            OnTokenValidated = ConfigureJwtTokenValidated,
        };
    }

    private static async Task ConfigureJwtChallenge(JwtBearerChallengeContext context)
    {
        context.HandleResponse();

        context.Response.StatusCode = StatusCodes.Status401Unauthorized;
        context.Response.ContentType = "application/json";

        var errorMessage = GetCustomErrorMessage(context.AuthenticateFailure ?? new Exception());

        var response = new ApiResponse<string>
        (
            status: StatusCodes.Status401Unauthorized,
            message: errorMessage,
            data: null
        );

        await context.Response.WriteAsync(
            JsonSerializer.Serialize(response, JsonSerializerSettings.CamelCaseOptions));
    }

    private static async Task ConfigureJwtTokenValidated(TokenValidatedContext context)
    {
        // Get the tenant identifier from the token
        var tenantId = context.Principal?.Claims.FirstOrDefault(c => c.Type == "Identifier")?.Value;

        if (tenantId == null)
        {
            context.Fail(MessageDescription.JwtMessageDescription.IdentifierNotFound);
        }

        var tenantInfo = await Task.Run(context.HttpContext.GetTenantInfo<AppTenantInfo>);
        var tenant = tenantInfo?.Identifier;

        if (tenant == null)
        {
            context.Fail(MessageDescription.JwtMessageDescription.TenantNotFound);
        }

        if (tenantId != tenant)
        {
            context.Fail(MessageDescription.JwtMessageDescription.AccessTokenNotValidForThisTenant);
        }
    }

    private static void ConfigureGoogleOptions(GoogleOptions options, GoogleSetting? googleSettings)
    {
        if (googleSettings == null)
        {
            throw new ArgumentNullException(nameof(googleSettings));
        }
        options.ClientId = googleSettings.ClientId;
        options.ClientSecret = googleSettings.ClientSecret;
        options.Scope.Add("openid");
        options.Scope.Add("profile");
        options.Scope.Add("email");

        options.SaveTokens = true; // Google OAuth token handling, but it won't affect JwtBearer
        options.CallbackPath = new PathString("/signin-google");
    }

    private static string GetCustomErrorMessage(Exception exception)
    {
        return exception switch
        {
            SecurityTokenExpiredException => MessageDescription.JwtMessageDescription.AccessTokenExpired,
            SecurityTokenInvalidIssuerException => MessageDescription.JwtMessageDescription.InvalidIssuer,
            SecurityTokenInvalidAudienceException => MessageDescription.JwtMessageDescription.InvalidAudience,
            SecurityTokenInvalidSignatureException => MessageDescription.JwtMessageDescription.InvalidSignature,
            _ => MessageDescription.JwtMessageDescription.InvalidCredentials
        };
    }
}
