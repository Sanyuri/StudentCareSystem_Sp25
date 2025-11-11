using Microsoft.Extensions.DependencyInjection;

using StudentCareSystem.Application.Commons.Interfaces;
using StudentCareSystem.Application.Commons.Interfaces.Jobs;

namespace StudentCareSystem.Application.Services.Job;

public class FailedJobEmailJobStrategy : IJobExecutionStrategy
{
    public async Task ExecuteJobForTenantAsync(IServiceProvider serviceProvider, object? parameter = null)
    {
        var emailService = serviceProvider.GetRequiredService<IEmailService>();
        await emailService.NotifyFailedJobAsync();
    }
}
