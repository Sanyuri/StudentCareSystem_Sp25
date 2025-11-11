using Microsoft.Extensions.DependencyInjection;

using StudentCareSystem.Application.Commons.Interfaces;
using StudentCareSystem.Application.Commons.Interfaces.Jobs;
using StudentCareSystem.Domain.Interfaces;

namespace StudentCareSystem.Application.Services.Job;

public class DeferScanJobStrategy : IJobExecutionStrategy
{
    public async Task ExecuteJobForTenantAsync(IServiceProvider serviceProvider, object? parameter = null)
    {
        var studentDeferService = serviceProvider.GetRequiredService<IStudentDeferService>();
        var semesterService = serviceProvider.GetRequiredService<ISemesterRepository>();
        var semester = await semesterService.GetCurrentSemesterAsync()
            ?? throw new InvalidOperationException("Current semester not found.");
        await studentDeferService.ScanStudentDeferBySemesterAsync(semester);
    }
}
