using Microsoft.Extensions.DependencyInjection;

using StudentCareSystem.Application.Commons.Interfaces;
using StudentCareSystem.Application.Commons.Interfaces.Jobs;
using StudentCareSystem.Application.Commons.Models.StudentNeedCares;

namespace StudentCareSystem.Application.Services.Job.ManualJob;

public class StudentNeedCareManuallyAnalyzeStrategy : IJobExecutionStrategy
{
    public async Task ExecuteJobForTenantAsync(IServiceProvider serviceProvider, object? parameter = null)
    {
        var studentNeedCareService = serviceProvider.GetRequiredService<IStudentNeedCareService>();
        var request = parameter as StudentNeedCareAnalyzeRequest
            ?? throw new ArgumentNullException(nameof(parameter), "StudentNeedCareAnalyzeRequest is required");
        await studentNeedCareService.AnalyzeStudentNeedCareAsync(request.Semestername);
    }
}
