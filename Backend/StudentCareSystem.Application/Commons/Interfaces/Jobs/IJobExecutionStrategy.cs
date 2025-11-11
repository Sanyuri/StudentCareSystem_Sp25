namespace StudentCareSystem.Application.Commons.Interfaces.Jobs;

public interface IJobExecutionStrategy
{
    Task ExecuteJobForTenantAsync(IServiceProvider serviceProvider, object? parameter = null);
}
