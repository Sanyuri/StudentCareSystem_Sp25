using Microsoft.Extensions.DependencyInjection;

using StudentCareSystem.Application.Commons.Interfaces;
using StudentCareSystem.Application.Commons.Interfaces.Jobs;

namespace StudentCareSystem.Application.Services.Job;

public class StudentScanJobStrategy : IJobExecutionStrategy
{

    public async Task ExecuteJobForTenantAsync(IServiceProvider serviceProvider, object? parameter = null)
    {
        var studentService = serviceProvider.GetRequiredService<IStudentService>();
        await studentService.ScanStudentAsync();
    }
}
