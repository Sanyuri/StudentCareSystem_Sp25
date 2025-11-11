using Microsoft.Extensions.DependencyInjection;

using StudentCareSystem.Application.Commons.Exceptions;
using StudentCareSystem.Application.Commons.Interfaces;
using StudentCareSystem.Application.Commons.Interfaces.Jobs;
using StudentCareSystem.Domain.Interfaces;


namespace StudentCareSystem.Application.Services.Job;

public class StudentAttendanceScanJobStrategy() : IJobExecutionStrategy
{
    /// <summary>
    /// Executes the job for a specific tenant asynchronously.
    /// </summary>
    /// <param name="serviceProvider">The service provider to resolve required services.</param>
    /// <param name="parameter">An optional parameter for the job execution.</param>
    /// <returns>A task that represents the asynchronous operation.</returns>
    /// <exception cref="EntityNotFoundException">Thrown when the current semester is not found.</exception>
    public async Task ExecuteJobForTenantAsync(IServiceProvider serviceProvider, object? parameter = null)
    {
        var studentAttendanceService = serviceProvider.GetRequiredService<IStudentAttendanceService>();
        var semesterRepository = serviceProvider.GetRequiredService<ISemesterRepository>();
        var currentSemester = await semesterRepository.GetCurrentSemesterAsync()
            ?? throw new EntityNotFoundException("Current semester not found");
        await studentAttendanceService.ScanStudentAttendanceAsync(currentSemester);
    }
}
