using Hangfire;
using Hangfire.Storage.Monitoring;

using Microsoft.Extensions.DependencyInjection;

using Serilog;

using StudentCareSystem.Application.Commons.Interfaces;
using StudentCareSystem.Application.Commons.Interfaces.Jobs;

namespace StudentCareSystem.Application.Services.Job;

public class EmailStatisEmailStrategy : IJobExecutionStrategy
{
    public async Task ExecuteJobForTenantAsync(IServiceProvider serviceProvider, object? parameter = null)
    {
        var emailService = serviceProvider.GetRequiredService<IEmailService>();
        await emailService.NotifyAdminNumberOfEmailsSentAsync(DateTime.Today);
    }
}
