using Microsoft.Extensions.DependencyInjection;

using StudentCareSystem.Application.Commons.Interfaces;
using StudentCareSystem.Application.Commons.Interfaces.Jobs;

namespace StudentCareSystem.Application.Services.Job;

public class SubjectScanJobStrategy : IJobExecutionStrategy
{
    public async Task ExecuteJobForTenantAsync(IServiceProvider serviceProvider, object? parameter = null)
    {
        var studentSubjectService = serviceProvider.GetRequiredService<ISubjectService>();
        await studentSubjectService.ScanSubjectAsync();
    }
}
