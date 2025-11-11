using StudentCareSystem.Application.Commons.Models;

namespace StudentCareSystem.API.Configs.Securities;
public static class CheckSumConfiguration
{
    /// <summary>
    /// Configures CheckSumSetting
    /// </summary>
    public static void RegisterCheckSumSetting(this IServiceCollection services, IConfiguration configuration)
    {
        services.Configure<CheckSumSetting>(configuration.GetSection("CheckSum"));
    }
}
