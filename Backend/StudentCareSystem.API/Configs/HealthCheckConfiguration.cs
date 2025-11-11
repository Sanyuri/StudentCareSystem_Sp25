using Finbuckle.MultiTenant.Abstractions;

using HealthChecks.UI.Client;

using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Diagnostics.HealthChecks;

using StudentCareSystem.Infrastructure.Models.Tenant;

namespace StudentCareSystem.API.Configs;

public static class HealthCheckConfiguration
{
    public static IServiceCollection ConfigureHealthChecks(this IServiceCollection services, IConfiguration configuration)
    {
        // Default health checks
        var healthChecks = services.AddHealthChecks()
            // Main database check
            .AddSqlServer(
                configuration.GetConnectionString("DefaultConnection") ?? string.Empty,
                name: "main-database",
                tags: ["database", "sql", "main"],
                failureStatus: HealthStatus.Degraded)

            // Redis check
            .AddRedis(
                configuration.GetConnectionString("Redis") ?? string.Empty,
                name: "redis-check",
                tags: ["cache", "redis"],
                failureStatus: HealthStatus.Degraded)

            // Self check
            .AddCheck("self", () => HealthCheckResult.Healthy("API is running"),
                tags: ["api"]);

        // Add tenant-aware health check
        healthChecks.AddCheck<TenantDatabasesHealthCheck>(
            "tenant-databases",
            failureStatus: HealthStatus.Degraded,
            tags: ["database", "sql", "tenant"]);

        return services;
    }

    public static IApplicationBuilder UseHealthChecks(this IApplicationBuilder app)
    {
        app.UseHealthChecks("/b5f3e3ef-3f2e-4b2f-9a8e-16e0c0379ff2", new HealthCheckOptions
        {
            ResponseWriter = UIResponseWriter.WriteHealthCheckUIResponse,
            AllowCachingResponses = false
        });

        // Specialized endpoints
        app.UseHealthChecks("/b5f3e3ef-3f2e-4b2f-9a8e-16e0c0379ff2/ready", new HealthCheckOptions
        {
            Predicate = registration => registration.Tags.Contains("ready"),
            ResponseWriter = UIResponseWriter.WriteHealthCheckUIResponse
        });

        app.UseHealthChecks("/b5f3e3ef-3f2e-4b2f-9a8e-16e0c0379ff2/live", new HealthCheckOptions
        {
            Predicate = _ => false, // Only check if the app is running
            ResponseWriter = UIResponseWriter.WriteHealthCheckUIResponse
        });

        // Tenant-specific health checks
        app.UseHealthChecks("/b5f3e3ef-3f2e-4b2f-9a8e-16e0c0379ff2/tenants", new HealthCheckOptions
        {
            Predicate = registration => registration.Tags.Contains("tenant"),
            ResponseWriter = UIResponseWriter.WriteHealthCheckUIResponse
        });

        return app;
    }
}

/// <summary>
/// Health check that verifies connectivity to all tenant databases
/// </summary>
public class TenantDatabasesHealthCheck(IMultiTenantStore<AppTenantInfo> tenantStore) : IHealthCheck
{
    private readonly IMultiTenantStore<AppTenantInfo> _tenantStore = tenantStore;

    public async Task<HealthCheckResult> CheckHealthAsync(HealthCheckContext context, CancellationToken cancellationToken = default)
    {
        var tenants = await _tenantStore.GetAllAsync();
        var tenantResults = new Dictionary<string, object>();
        List<Exception> exceptions = [];
        bool isHealthy = true;

        foreach (var tenant in tenants)
        {
            try
            {
                // Kiểm tra kết nối với cơ sở dữ liệu của tenant
                using var connection = new SqlConnection(tenant.ConnectionString);
                await connection.OpenAsync(cancellationToken);

                // Thực hiện truy vấn đơn giản để kiểm tra cơ sở dữ liệu có phản hồi hay không
                using var command = connection.CreateCommand();
                command.CommandText = "SELECT 1";
                await command.ExecuteScalarAsync(cancellationToken);

                tenantResults.Add(tenant?.Name ?? "", new { Status = "Healthy" });
            }
            catch (Exception ex)
            {
                isHealthy = false;
                tenantResults.Add(tenant?.Name ?? "", new { Status = "Unhealthy", Error = ex.Message });
                exceptions.Add(ex);  // Thêm exception vào danh sách
            }
        }

        if (isHealthy)
        {
            return HealthCheckResult.Healthy("All tenant databases are healthy", tenantResults);
        }

        // Gom các exception lại thành một AggregateException nếu có lỗi
        var aggregatedException = exceptions.Count != 0 ? new AggregateException(exceptions) : null;

        return HealthCheckResult.Degraded(
            "One or more tenant databases are unhealthy",
            aggregatedException,
            tenantResults);
    }

}
