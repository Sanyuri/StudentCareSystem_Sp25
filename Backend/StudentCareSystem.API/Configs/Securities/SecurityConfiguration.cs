namespace StudentCareSystem.API.Configs.Securities;

public static class SecurityConfiguration
{
    /// <summary>
    /// Add CheckSumSetting, Cors, Csrf, and Authentication
    /// </summary>
    /// <returns></returns>
    public static void ConfigSecurity(this IServiceCollection services, IConfiguration configuration, string policyName, IWebHostEnvironment env)
    {

        services.ConfigureCsrf();
        services.ConfigurePolicy();
        services.ConfigureJwtBearer(configuration);
        services.RegisterCheckSumSetting(configuration);
        services.ConfigureCors(configuration, policyName);
        services.ConfigurePasswordHasher(configuration);
        services.ConfigureDataProtection(configuration, env);
    }
}
