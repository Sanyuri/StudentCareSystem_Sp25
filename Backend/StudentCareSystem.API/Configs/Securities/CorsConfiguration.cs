using StudentCareSystem.Application.Commons.Models;

namespace StudentCareSystem.API.Configs.Securities;
public static class CorsConfiguration
{
    /// <summary>
    /// Config CORS
    /// </summary>
    /// <param name="services"></param>
    /// <param name="policyName"></param>
    /// <returns></returns>
    public static void ConfigureCors(this IServiceCollection services, IConfiguration configuration, string policyName)
    {
        var corsSettings = configuration.GetSection("Cors").Get<CorsSetting>() ?? throw new InvalidOperationException("Cors settings not found");
        services.AddCors(options =>
        {
            options.AddPolicy(policyName,
                builder =>
                {
                    builder.WithOrigins(corsSettings.AllowedOrigins)
                        .AllowAnyMethod()
                        .AllowAnyHeader()
                        .SetIsOriginAllowed(origin => corsSettings.AllowedOrigins.Contains(origin))
                        .AllowCredentials();
                });
        });
    }
}
