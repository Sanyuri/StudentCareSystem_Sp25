using Microsoft.Extensions.DependencyInjection;

using StudentCareSystem.Application.Commons.Exceptions;
using StudentCareSystem.Application.Commons.Interfaces;
using StudentCareSystem.Application.Commons.Interfaces.Jobs;
using StudentCareSystem.Domain.Interfaces;


namespace StudentCareSystem.Application.Services.Job.ManualJob;

public class DeferManuallyScanJobStrategy(
) : IJobExecutionStrategy
{
    /// <summary>
    /// Executes the job for a specific tenant asynchronously.
    /// </summary>
    /// <param name="serviceProvider">The service provider to resolve required services.</param>
    /// <param name="parameter">Optional parameter containing the semester name as a string.</param>
    /// <returns>A task that represents the asynchronous operation.</returns>
    /// <exception cref="ArgumentNullException">Thrown when the parameter is null or not a string.</exception>
    /// <exception cref="EntityNotFoundException">Thrown when the selected semester is not found.</exception>
    public async Task ExecuteJobForTenantAsync(IServiceProvider serviceProvider, object? parameter = null)
    {
        var _semesterName = parameter as string
            ?? throw new ArgumentNullException(nameof(parameter), "Semester name is required");
        var studentDeferService = serviceProvider.GetRequiredService<IStudentDeferService>();
        var semesterRepository = serviceProvider.GetRequiredService<ISemesterRepository>();
        var selectedSemester = await semesterRepository.GetSemesterByNameAsync(_semesterName)
            ?? throw new EntityNotFoundException("Selected semester not found");
        await studentDeferService.ScanStudentDeferBySemesterAsync(selectedSemester);
    }
}
