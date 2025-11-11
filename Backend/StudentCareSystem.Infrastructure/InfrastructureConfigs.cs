using Microsoft.Extensions.DependencyInjection;

using NetCore.AutoRegisterDi;

using StudentCareSystem.Domain.Interfaces;
using StudentCareSystem.Infrastructure.Repositories;

namespace StudentCareSystem.Infrastructure;

public static class InfrastructureConfigs
{
    /// <summary>
    /// Configure auto register repository
    /// </summary>
    /// <param name="services"></param>
    public static void ConfigureAutoRegisterRepository(IServiceCollection services)
    {
        services.RegisterAssemblyPublicNonGenericClasses()
            .Where(c => c.Name.EndsWith("Repository"))
            .AsPublicImplementedInterfaces(ServiceLifetime.Scoped);

        services.AddScoped<IUnitOfWork, UnitOfWork>();
    }
}
