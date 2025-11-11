using System.Security.Claims;

namespace StudentCareSystem.API.Configs.Securities;
public static class PolicyConfiguration
{
    /// <summary>
    /// Configure policy
    /// </summary>
    /// <param name="services"></param>
    public static void ConfigurePolicy(this IServiceCollection services)
    {
        // Configure Authorization
        services.AddAuthorizationBuilder()
            // Configure Authorization
            .AddPolicy("Admin", policy => policy.RequireClaim(ClaimTypes.Role, "Admin"))
            .AddPolicy("Officer", policy => policy.RequireClaim(ClaimTypes.Role, "User"))
            .AddPolicy("Manager", policy => policy.RequireClaim(ClaimTypes.Role, "Manager"));
    }
}
