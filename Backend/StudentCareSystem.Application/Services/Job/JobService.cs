using Finbuckle.MultiTenant;
using Finbuckle.MultiTenant.Abstractions;

using Hangfire;

using Microsoft.Extensions.DependencyInjection;

using StudentCareSystem.Application.Commons.Interfaces;
using StudentCareSystem.Application.Commons.Interfaces.Jobs;
using StudentCareSystem.Application.Commons.Models.Attendances;
using StudentCareSystem.Application.Commons.Models.Defers;
using StudentCareSystem.Application.Commons.Models.Emails;
using StudentCareSystem.Application.Commons.Models.StudentNeedCares;
using StudentCareSystem.Application.Services.Job.ManualJob;
using StudentCareSystem.Domain.Enums;
using StudentCareSystem.Infrastructure.Models.Tenant;
using StudentCareSystem.Infrastructure.Utilities;

namespace StudentCareSystem.Application.Services.Job;

public class JobService(
    ITenantService tenantService,
    IRecurringJobManager recurringJobManager,
    IBackgroundJobClient backgroundJobClient,
    IServiceScopeFactory serviceScopeFactory,
    IMultiTenantContextAccessor<AppTenantInfo> multiTenantContextAccessor
) : IJobService
{
    public async Task RegisterJobs()
    {
        var tenants = await tenantService.GetAllAsync();
        foreach (var tenant in tenants)
        {
            var tenantIdentifier = tenant.Identifier;
            var executionMinutesOffset = tenant.AdjustedExecutionTime;

            //Job for scan attendance each day at 7, 11, 16 utc
            recurringJobManager.AddOrUpdate(
                tenantIdentifier + "-" + RecurringJobType.ScanAttendance,
                () => ExecuteStudentAttendanceScanJob(tenantIdentifier),
                CronExpressionHelper.AdjustCronExpressionByMinutes("0 7,11,16 * * *", executionMinutesOffset),
                new RecurringJobOptions { TimeZone = TimeZoneInfo.Utc }
            );

            //Job for get semester each monday of week at 15h utc
            recurringJobManager.AddOrUpdate(
                tenantIdentifier + "-" + RecurringJobType.SemesterScan,
                () => ExecuteSemesterScanJob(tenantIdentifier),
                CronExpressionHelper.AdjustCronExpressionByMinutes("0 15 * * *", executionMinutesOffset),
                new RecurringJobOptions { TimeZone = TimeZoneInfo.Utc }
            );

            //Job for send Attendance Email at 20h utc 
            recurringJobManager.AddOrUpdate(
                tenantIdentifier + "-" + RecurringJobType.SendAttendanceNotification,
                () => ExecuteAttendanceEmailSendJob(tenantIdentifier),
                CronExpressionHelper.AdjustCronExpressionByMinutes("0 20 * * *", executionMinutesOffset),
                new RecurringJobOptions { TimeZone = TimeZoneInfo.Utc }
            );

            // Job for scan student 
            recurringJobManager.AddOrUpdate(
                tenantIdentifier + "-" + RecurringJobType.ScanStudent,
                () => ExecuteStudentScanJob(tenantIdentifier),
                CronExpressionHelper.AdjustCronExpressionByMinutes("0 2 * * *", executionMinutesOffset),
                new RecurringJobOptions { TimeZone = TimeZoneInfo.Utc }
            );

            // job for scan student defer at 3h utc
            recurringJobManager.AddOrUpdate(
                tenantIdentifier + "-" + RecurringJobType.ScanStudentDefer,
                () => ExecuteStudentDeferScanJob(tenantIdentifier),
                CronExpressionHelper.AdjustCronExpressionByMinutes("0 3 * * *", executionMinutesOffset),
                new RecurringJobOptions { TimeZone = TimeZoneInfo.Utc }
            );

            // job for scan subject job at 2h utc
            recurringJobManager.AddOrUpdate(
                tenantIdentifier + "-" + RecurringJobType.ScanSubject,
                () => ExecuteSubjectScanJob(tenantIdentifier),
                CronExpressionHelper.AdjustCronExpressionByMinutes("0 2 * * *", executionMinutesOffset),
                new RecurringJobOptions { TimeZone = TimeZoneInfo.Utc }
            );

            // job for check email status hourly
            recurringJobManager.AddOrUpdate(
                tenantIdentifier + "-" + RecurringJobType.SendEmailAgain,
                () => ExecuteCheckEmailStatusJob(tenantIdentifier),
                CronExpressionHelper.AdjustCronExpressionByMinutes("1 * * * *", executionMinutesOffset),
                new RecurringJobOptions { TimeZone = TimeZoneInfo.Utc }
            );

            // job for scan student subject at 5h utc
            recurringJobManager.AddOrUpdate(
                tenantIdentifier + "-" + RecurringJobType.ScanStudentSubject,
                () => ExecuteStudentSubjectScanJob(tenantIdentifier),
                CronExpressionHelper.AdjustCronExpressionByMinutes("0 5 * * *", executionMinutesOffset),
                new RecurringJobOptions { TimeZone = TimeZoneInfo.Utc }
            );

            // job for scan point at 6h utc
            recurringJobManager.AddOrUpdate(
                tenantIdentifier + "-" + RecurringJobType.ScanStudentPoint,
                () => ExecuteStudentPointScanJob(tenantIdentifier),
                CronExpressionHelper.AdjustCronExpressionByMinutes("0 6 * * *", executionMinutesOffset),
                new RecurringJobOptions { TimeZone = TimeZoneInfo.Utc }
            );

            // job for analyze student need care at 1h utc
            recurringJobManager.AddOrUpdate(
                tenantIdentifier + "-" + RecurringJobType.AnalyzeStudentNeedCare,
                () => ExecuteStudentNeedCareScanJob(tenantIdentifier),
                CronExpressionHelper.AdjustCronExpressionByMinutes("0 1 * * *", executionMinutesOffset),
                new RecurringJobOptions { TimeZone = TimeZoneInfo.Utc }
            );

            // job for scan failed job at each 4 hour a day
            recurringJobManager.AddOrUpdate(
                tenantIdentifier + "-" + RecurringJobType.ScanFailedJob,
                () => ExecuteFailedJobEmailJob(tenantIdentifier),
                CronExpressionHelper.AdjustCronExpressionByMinutes("4 * * * *", executionMinutesOffset),
                new RecurringJobOptions { TimeZone = TimeZoneInfo.Utc }
            );

            // job for send email statistics at 23h utc 
            recurringJobManager.AddOrUpdate(
                tenantIdentifier + "-" + RecurringJobType.SendEmailStatistics,
                () => ExecuteEmailStatisEmailJob(tenantIdentifier),
                CronExpressionHelper.AdjustCronExpressionByMinutes("0 23 * * *", executionMinutesOffset),
                new RecurringJobOptions { TimeZone = TimeZoneInfo.Utc }
            );
        }
    }

    public void ExecuteAttendanceScanManually(ScanAttendanceRequest request)
    {
        var attendanceManuallyScanJobStrategy = new AttendanceManuallyScanJobStrategy();
        backgroundJobClient.Enqueue(() => ExecuteJobForTenant(GetIdentifier(), attendanceManuallyScanJobStrategy, request.SemesterName));
    }

    public void ExecuteSendAttendanceNotificationManually(SendAttendanceNotificationRequest request)
    {
        var sendAttendanceNotificationManuallyJobStrategy = new AttendanceManuallyEmailSendJobStrategy();
        backgroundJobClient.Enqueue(() => ExecuteJobForTenant(GetIdentifier(), sendAttendanceNotificationManuallyJobStrategy, request.Date));
    }

    public void ExecuteSendDeferNotificationManually(SendDeferEmailDto request)
    {
        var sendDeferNotificationManuallyJobStrategy = new DeferManuallyEmailSendJobStrategy();
        backgroundJobClient.Enqueue(() => ExecuteJobForTenant(GetIdentifier(), sendDeferNotificationManuallyJobStrategy, request));
    }

    public void ExecuteDeferScanManually(ScanDeferRequest request)
    {
        var deferManuallyScanJobStrategy = new DeferManuallyScanJobStrategy();
        backgroundJobClient.Enqueue(() => ExecuteJobForTenant(GetIdentifier(), deferManuallyScanJobStrategy, request.SemesterName));
    }

    public void ExecuteSendFailedSubjectNotificationManually(SendFailedSubjectEmailDto request)
    {
        var sendFailedSubjectNotificationManuallyJobStrategy = new FailedSubjectManuallyEmailSendJobStrategy();
        backgroundJobClient.Enqueue(() => ExecuteJobForTenant(GetIdentifier(), sendFailedSubjectNotificationManuallyJobStrategy, request));
    }

    public void ExecuteStudentNeedCareAnalyzeManually(StudentNeedCareAnalyzeRequest request)
    {
        var studentNeedCareAnalyzeManuallyJobStrategy = new StudentNeedCareManuallyAnalyzeStrategy();
        backgroundJobClient.Enqueue(() => ExecuteJobForTenant(GetIdentifier(), studentNeedCareAnalyzeManuallyJobStrategy, request));
    }

    private string GetIdentifier()
    {
        return multiTenantContextAccessor.MultiTenantContext?.TenantInfo?.Identifier
            ?? throw new InvalidOperationException("Tenant identifier is null");
    }

    [AutomaticRetry(Attempts = 0)]
    public async Task ExecuteJobForTenant(string? tenantIdentifier, IJobExecutionStrategy jobExecutionStrategy, object? parameter = null)
    {
        using var scope = serviceScopeFactory.CreateScope();
        var serviceProvider = scope.ServiceProvider;
        ArgumentNullException.ThrowIfNull(tenantIdentifier);
        var tenantInfo = await tenantService.GetByIdentifierAsync(tenantIdentifier);
        if (tenantInfo != null)
        {
            var mtcSetter = serviceProvider.GetRequiredService<IMultiTenantContextSetter>();
            var multiTenantContext = new MultiTenantContext<AppTenantInfo>
            {
                TenantInfo = tenantInfo,
                StrategyInfo = null,
                StoreInfo = null
            };
            mtcSetter.MultiTenantContext = multiTenantContext;
            await jobExecutionStrategy.ExecuteJobForTenantAsync(serviceProvider, parameter);
        }
        ArgumentException.ThrowIfNullOrEmpty(nameof(tenantInfo));
    }

    [AutomaticRetry(Attempts = 0)]
    public Task ExecuteStudentAttendanceScanJob(string? tenantIdentifier)
    {
        return ExecuteJobForTenant(tenantIdentifier, new StudentAttendanceScanJobStrategy());
    }

    [AutomaticRetry(Attempts = 0)]
    public Task ExecuteAttendanceEmailSendJob(string? tenantIdentifier)
    {
        return ExecuteJobForTenant(tenantIdentifier, new AttendanceEmailSendJobStrategy());
    }

    [AutomaticRetry(Attempts = 0)]
    public Task ExecuteStudentScanJob(string? tenantIdentifier)
    {
        return ExecuteJobForTenant(tenantIdentifier, new StudentScanJobStrategy());
    }

    [AutomaticRetry(Attempts = 0)]
    public Task ExecuteStudentDeferScanJob(string? tenantIdentifier)
    {
        return ExecuteJobForTenant(tenantIdentifier, new DeferScanJobStrategy());
    }

    [AutomaticRetry(Attempts = 0)]
    public Task ExecuteSemesterScanJob(string? tenantIdentifier)
    {
        return ExecuteJobForTenant(tenantIdentifier, new SemesterScanJobStrategy());
    }

    [AutomaticRetry(Attempts = 0)]
    public Task ExecuteSubjectScanJob(string? tenantIdentifier)
    {
        return ExecuteJobForTenant(tenantIdentifier, new SubjectScanJobStrategy());
    }

    [AutomaticRetry(Attempts = 0)]
    public Task ExecuteCheckEmailStatusJob(string? tenantIdentifier)
    {
        return ExecuteJobForTenant(tenantIdentifier, new CheckEmailStatusJobStrategy());
    }

    [AutomaticRetry(Attempts = 0)]
    public Task ExecuteStudentPointScanJob(string? tenantIdentifier)
    {
        return ExecuteJobForTenant(tenantIdentifier, new StudentPointScanJobStrategy());
    }

    [AutomaticRetry(Attempts = 0)]
    public Task ExecuteStudentSubjectScanJob(string? tenantIdentifier)
    {
        return ExecuteJobForTenant(tenantIdentifier, new StudentSubjectScanJobStrategy());
    }

    [AutomaticRetry(Attempts = 0)]
    public Task ExecuteStudentNeedCareScanJob(string? tenantIdentifier)
    {
        return ExecuteJobForTenant(tenantIdentifier, new AnalyzeStudentNeedCareJobStrategy());
    }

    [AutomaticRetry(Attempts = 0)]
    public Task ExecuteFailedJobEmailJob(string? tenantIdentifier)
    {
        return ExecuteJobForTenant(tenantIdentifier, new FailedJobEmailJobStrategy());
    }

    [AutomaticRetry(Attempts = 0)]
    public Task ExecuteEmailStatisEmailJob(string? tenantIdentifier)
    {
        return ExecuteJobForTenant(tenantIdentifier, new EmailStatisEmailStrategy());
    }
}
