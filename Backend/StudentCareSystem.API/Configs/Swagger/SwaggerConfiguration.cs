using Microsoft.OpenApi.Models;

namespace StudentCareSystem.API.Configs.Swagger;
public static class SwaggerConfiguration
{
    public static void ConfigureSwagger(this IServiceCollection services)
    {
        services.AddSwaggerGen(c =>
        {
            c.OperationFilter<AddHeaderOperationFilter>();
            c.SwaggerDoc("v1", new OpenApiInfo { Title = "My API", Version = "v1" });

            // Cấu hình OAuth2 sử dụng Google
            c.AddSecurityDefinition("oauth2", new OpenApiSecurityScheme
            {
                Type = SecuritySchemeType.OAuth2,
                Flows = new OpenApiOAuthFlows
                {
                    AuthorizationCode = new OpenApiOAuthFlow
                    {
                        AuthorizationUrl = new Uri("https://accounts.google.com/o/oauth2/auth"),
                        TokenUrl = new Uri("https://oauth2.googleapis.com/token"),
                        Scopes = new Dictionary<string, string>
                        {
                            { "openid", "OpenID" },
                            { "profile", "User profile information" },
                            { "email", "User email" }
                        }
                    }
                }
            });
            // Cấu hình Bearer token cho API
            c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
            {
                Type = SecuritySchemeType.Http,
                Scheme = "bearer",
                BearerFormat = "JWT",
                Description = "Enter JWT Bearer token",
                In = ParameterLocation.Header,
                Name = "Authorization"
            });
            // Cấu hình requirement cho Bearer token
            c.AddSecurityRequirement(new OpenApiSecurityRequirement
            {
                {
                    new OpenApiSecurityScheme
                    {
                        Reference = new OpenApiReference
                        {
                            Type = ReferenceType.SecurityScheme,
                            Id = "Bearer"
                        }
                    },
                    new List<string>()
                }
            });
        });
    }
}
