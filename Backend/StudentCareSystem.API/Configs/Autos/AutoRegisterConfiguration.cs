using StudentCareSystem.Application;
using StudentCareSystem.Infrastructure;

namespace StudentCareSystem.API.Configs.Autos;
public static class AutoRegisterConfiguration
{
    /// <summary>
    /// Configure Auto Register Services
    /// </summary>
    /// <param name="services"></param>
    public static void ConfigureAutoRegisterServices(this IServiceCollection services)
    {
        ApplicationConfigs.ConfigureAutoRegisterServices(services);
        InfrastructureConfigs.ConfigureAutoRegisterRepository(services);
    }
}
