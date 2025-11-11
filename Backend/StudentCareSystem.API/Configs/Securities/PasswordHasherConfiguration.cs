using Microsoft.AspNetCore.Identity;

using StudentCareSystem.Domain.Entities;

namespace StudentCareSystem.API.Configs.Securities;
public static class PasswordHasherConfiguration
{
    /// <summary>
    /// Configure password hasher
    /// </summary>
    /// <param name="services"></param>
    /// <param name="configuration"></param>
    public static void ConfigurePasswordHasher(this IServiceCollection services, IConfiguration configuration)
    {
        // Register PasswordHasher
        services.AddScoped<IPasswordHasher<User>, PasswordHasher<User>>();
    }
}
