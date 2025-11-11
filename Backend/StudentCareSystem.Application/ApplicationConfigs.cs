using Microsoft.Extensions.DependencyInjection;

using NetCore.AutoRegisterDi;

namespace StudentCareSystem.Application;
public static class ApplicationConfigs
{
    /// <summary>
    /// Configure auto register services
    /// </summary>
    /// <param name="services"></param>
    public static void ConfigureAutoRegisterServices(IServiceCollection services)
    {
        services.RegisterAssemblyPublicNonGenericClasses()
            .Where(c => c.Name.EndsWith("Service"))
            .AsPublicImplementedInterfaces(ServiceLifetime.Scoped);
    }
}
