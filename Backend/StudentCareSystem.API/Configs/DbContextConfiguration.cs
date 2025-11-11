using Finbuckle.MultiTenant;
using Finbuckle.MultiTenant.Abstractions;

using Microsoft.EntityFrameworkCore;

using Serilog;

using StudentCareSystem.Domain.Constants;
using StudentCareSystem.Infrastructure.Data;
using StudentCareSystem.Infrastructure.Models.Tenant;

namespace StudentCareSystem.API.Configs;
public static class DbContextConfiguration
{
    /// <summary>
    /// Configures DbContext
    /// </summary>
    /// <param name="services"></param>
    /// <param name="configuration"></param>
    public static void ConfigureDbContext(this IServiceCollection services, IConfiguration configuration, IWebHostEnvironment environment)
    {
        services.AddDbContext<ScsDbContext>();
        services.AddMultiTenant<AppTenantInfo>()
            .WithConfigurationStore()
            .WithHeaderStrategy("CampusCode");
        using var serviceProvider = services.BuildServiceProvider();
        try
        {
            if (environment.IsDevelopment())
            {
                var tenantInfoStore = serviceProvider.GetRequiredService<IMultiTenantStore<AppTenantInfo>>();
                var tenants = tenantInfoStore.GetAllAsync().Result;

                foreach (var tenant in tenants)
                {
                    using var tenantScope = serviceProvider.CreateScope();
                    var mtcSetter = serviceProvider.GetRequiredService<IMultiTenantContextSetter>();
                    var multiTenantContext = new MultiTenantContext<AppTenantInfo>
                    {
                        TenantInfo = tenant,
                        StrategyInfo = null,
                        StoreInfo = null
                    };
                    mtcSetter.MultiTenantContext = multiTenantContext;
                    var tenantDbContext = tenantScope.ServiceProvider.GetRequiredService<ScsDbContext>();
                    try
                    {
                        var pendingMigrations = tenantDbContext.Database.GetPendingMigrations();
                        if (pendingMigrations.Any())
                        {
                            Log.Information(MessageDescription.DbContextMessageDescription.MigrateDatabaseForTenant, tenant.Identifier);
                            tenantDbContext.Database.Migrate();
                            Log.Information(MessageDescription.DbContextMessageDescription.MigrateDatabaseForTenantSuccess, tenant.Identifier);
                        }
                        else
                        {
                            Log.Information(MessageDescription.DbContextMessageDescription.NoPendingMigrationForTenant, tenant.Identifier);
                        }
                    }
                    catch (Exception ex)
                    {
                        Log.Error(ex, MessageDescription.DbContextMessageDescription.MigrateDatabaseForTenantFailed, tenant.Identifier);
                    }
                }
            }
        }
        catch (Exception ex)
        {
            Log.Error(ex, MessageDescription.DbContextMessageDescription.DatabaseConnectionNotConfiguredProperly);
            throw new InvalidOperationException(MessageDescription.DbContextMessageDescription.DatabaseConnectionNotConfiguredProperly, ex);
        }
    }
}
