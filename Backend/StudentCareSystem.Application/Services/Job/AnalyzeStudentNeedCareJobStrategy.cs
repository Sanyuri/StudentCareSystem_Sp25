using Microsoft.Extensions.DependencyInjection;

using StudentCareSystem.Application.Commons.Interfaces;
using StudentCareSystem.Application.Commons.Interfaces.Jobs;

namespace StudentCareSystem.Application.Services.Job
{
    public class AnalyzeStudentNeedCareJobStrategy : IJobExecutionStrategy
    {
        public async Task ExecuteJobForTenantAsync(IServiceProvider serviceProvider, object? parameter = null)
        {
            var studentNeedCareService = serviceProvider.GetRequiredService<IStudentNeedCareService>();
            var semesterService = serviceProvider.GetRequiredService<ISemesterService>();
            var currentSemester = await semesterService.GetCurrentSemesterAsync()
                ?? throw new Exception("Current semester not found.");
            // Only analyze during the first 7 days of the semester
            DateTime currentDate = DateTime.UtcNow;
            if (currentDate < currentSemester.StartDate || currentDate > currentSemester.StartDate.AddDays(7))
                return;
            await studentNeedCareService.AnalyzeStudentNeedCareAsync(currentSemester.SemesterName);
        }
    }
}
