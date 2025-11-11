using Microsoft.Extensions.DependencyInjection;

using StudentCareSystem.Application.Commons.Interfaces;
using StudentCareSystem.Application.Commons.Interfaces.Jobs;

namespace StudentCareSystem.Application.Services.Job.ManualJob;

public class AttendanceManuallyEmailSendJobStrategy : IJobExecutionStrategy
{

    /// <summary>
    /// Executes the job for a specific tenant asynchronously.
    /// </summary>
    /// <param name="serviceProvider">The service provider to resolve dependencies.</param>
    /// <param name="parameter">The parameter containing the date and time for the job execution. Must be of type <see cref="DateTime"/>.</param>
    /// <returns>A task that represents the asynchronous operation.</returns>
    /// <exception cref="ArgumentNullException">Thrown when the parameter is null or not of type <see cref="DateTime"/>.</exception>
    public async Task ExecuteJobForTenantAsync(IServiceProvider serviceProvider, object? parameter = null)
    {
        var emailService = serviceProvider.GetRequiredService<IEmailService>();
        var _dateTime = parameter as DateTime? ??
                       throw new ArgumentNullException(nameof(parameter), "DateTime is required");
        await emailService.SendAttendanceNotificationAsync(_dateTime);
    }

}
