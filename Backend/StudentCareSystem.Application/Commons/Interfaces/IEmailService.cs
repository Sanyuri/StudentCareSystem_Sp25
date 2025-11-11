using StudentCareSystem.Application.Commons.Models.Defers;

namespace StudentCareSystem.Application.Commons.Interfaces;

public interface IEmailService
{
    Task SendAttendanceNotificationAsync(DateTime dateTime);
    Task SendStudentDeferAsync(SendDeferEmailDto sendDeferEmailDto);
    Task SendFailedSubjectNotificationsAsync(SendFailedSubjectEmailDto sendFailedSubjectEmailDto);
    Task ResendEmailFailAsync();
    Task ResendUserEmailFailAsync();
    Task CheckEmailStatusAsync();
    Task CheckUserEmailStatusAsync();
    Task NotifyAdminNumberOfEmailsSentAsync(DateTime dateTime);
    Task NotifyFailedJobAsync();
    Task SendStudentCareSummaryEmails();
}
