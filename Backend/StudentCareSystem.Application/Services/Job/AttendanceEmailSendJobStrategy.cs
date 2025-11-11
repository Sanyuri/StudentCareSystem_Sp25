using Microsoft.Extensions.DependencyInjection;

using StudentCareSystem.Application.Commons.Interfaces;
using StudentCareSystem.Application.Commons.Interfaces.Jobs;

namespace StudentCareSystem.Application.Services.Job;

public class AttendanceEmailSendJobStrategy : IJobExecutionStrategy
{

    /// <summary>
    /// Executes the job for a specific tenant asynchronously.
    /// </summary>
    /// <param name="serviceProvider">The service provider to resolve dependencies.</param>
    /// <param name="parameter">An optional parameter for the job execution.</param>
    /// <returns>A task that represents the asynchronous operation.</returns>
    public async Task ExecuteJobForTenantAsync(IServiceProvider serviceProvider, object? parameter = null)
    {
        var emailService = serviceProvider.GetRequiredService<IEmailService>();
        await emailService.SendAttendanceNotificationAsync(DateTime.UtcNow);

        await emailService.SendAttendanceNotificationAsync(DateTime.UtcNow.AddDays(-1));
    }
}
