using StudentCareSystem.Application.Commons.Models.Attendances;
using StudentCareSystem.Application.Commons.Models.Defers;
using StudentCareSystem.Application.Commons.Models.Emails;
using StudentCareSystem.Application.Commons.Models.StudentNeedCares;

namespace StudentCareSystem.Application.Commons.Interfaces.Jobs;

public interface IJobService
{
    Task RegisterJobs();
    void ExecuteAttendanceScanManually(ScanAttendanceRequest request);
    void ExecuteDeferScanManually(ScanDeferRequest request);
    void ExecuteSendAttendanceNotificationManually(SendAttendanceNotificationRequest request);
    void ExecuteSendDeferNotificationManually(SendDeferEmailDto request);
    void ExecuteSendFailedSubjectNotificationManually(SendFailedSubjectEmailDto request);
    void ExecuteStudentNeedCareAnalyzeManually(StudentNeedCareAnalyzeRequest request);
}
