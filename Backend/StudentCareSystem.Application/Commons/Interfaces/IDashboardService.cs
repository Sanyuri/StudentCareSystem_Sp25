
using StudentCareSystem.Application.Commons.Models.Dashboard;
using StudentCareSystem.Domain.Enums;

namespace StudentCareSystem.Application.Commons.Interfaces
{
    public interface IDashboardService
    {
        Task<IEnumerable<DashboardApplicationByTimeResponse>> GetApplicationByTimeDashboard(DashboardApplicationByTimeRequest request);
        Task<IEnumerable<DashboardEmailLogByTimeResponse>?> GetEmailLogByTimeDashboard(DashboardEmailLogByTimeRequest request);
        Task<DashboardStudentCaredDto?> GetStudentCaredDashboard();
        Task<DashboardStudentRemindDto> GetStudentRemindDashboard(EmailType emailType);
        Task<IEnumerable<DashboardStudentRemindByTimeResponse>?> GetStudentReminderByTimeDashboard(DashboardStudentRemindRequest data);
        Task<DashboardTotalApplicationDto?> GetTotalApplicationDashboard();
        Task<DashboardStudentRemindDto?> GetTotalReminderDashboard();
    }
}
