using Hangfire;

using StudentCareSystem.Domain.Constants;
using StudentCareSystem.Infrastructure.Models;

namespace StudentCareSystem.API.Configs;

public static class HangfireConfiguration
{
    public static void ConfigureHangfire(this IServiceCollection services, IConfiguration configuration)
    {
        string connectionString = configuration.GetConnectionString("Hangfire") ?? throw new InvalidOperationException(MessageDescription.ConnectionStringMessageDescription.ConnectionStringNotConfiguredProperly);
        services.AddOptions<HangfireSetting>()
            .Bind(configuration.GetSection("Hangfire"))
            .ValidateDataAnnotations();
        services.AddHangfire(options =>
            options.SetDataCompatibilityLevel(CompatibilityLevel.Version_180)
                .UseRecommendedSerializerSettings()
                .UseSimpleAssemblyNameTypeSerializer()
                .UseSqlServerStorage(connectionString, new Hangfire.SqlServer.SqlServerStorageOptions
                {
                    CommandBatchMaxTimeout = TimeSpan.FromMinutes(5),
                    SlidingInvisibilityTimeout = TimeSpan.FromMinutes(5),
                    QueuePollInterval = TimeSpan.Zero,
                    UseRecommendedIsolationLevel = true,
                    DisableGlobalLocks = true,
                    EnableHeavyMigrations = false
                })
                .UseSerilogLogProvider()
                .UseDashboardMetrics()


            );
        // Multi tenant config
        services.AddHangfireServer();
    }
}
