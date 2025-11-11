using Microsoft.Extensions.DependencyInjection;

using StudentCareSystem.Application.Commons.Interfaces;
using StudentCareSystem.Application.Commons.Interfaces.Jobs;

namespace StudentCareSystem.Application.Services.Job;

public class SemesterScanJobStrategy : IJobExecutionStrategy
{
    public async Task ExecuteJobForTenantAsync(IServiceProvider serviceProvider, object? parameter = null)
    {
        var semesterService = serviceProvider.GetRequiredService<ISemesterService>();
        await semesterService.ScanSemesterAsync();
    }
}
