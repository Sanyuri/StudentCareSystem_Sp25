using StudentCareSystem.Application.Commons.Exceptions;
using StudentCareSystem.Application.Commons.Interfaces;
using StudentCareSystem.Application.Commons.Models.ApplicationTypes;
using StudentCareSystem.Application.Commons.Models.Dashboard;
using StudentCareSystem.Domain.Entities;
using StudentCareSystem.Domain.Enums;
using StudentCareSystem.Domain.Interfaces;
using StudentCareSystem.Infrastructure.Specifications;

namespace StudentCareSystem.Application.Services;

public class DashboardService(
  IUnitOfWork unitOfWork
) : IDashboardService
{
    public async Task<IEnumerable<DashboardApplicationByTimeResponse>> GetApplicationByTimeDashboard(DashboardApplicationByTimeRequest request)
    {
        var specification = new SpecificationBuilder<StudentApplication>()
          .Where(studentApplication => studentApplication.CreatedAt >= request.FromDate &&
                         studentApplication.CreatedAt <= request.ToDate).Build();
        var applications = await unitOfWork.StudentApplicationRepository.GetAllAsync(specification);

        //group data by created date and status
        var groupData = applications.GroupBy(application => new { application.CreatedAt.Date, application.Status });
        return groupData.Select(group => new DashboardApplicationByTimeResponse
        {
            CreatedAt = group.Key.Date,
            Status = group.Key.Status,
            TotalReceived = group.Count(a => a.Status == ApplicationStatus.Receive),
            TotalReturned = group.Count(a => a.Status == ApplicationStatus.Return)
        });
    }

    public async Task<IEnumerable<DashboardEmailLogByTimeResponse>?> GetEmailLogByTimeDashboard(DashboardEmailLogByTimeRequest request)
    {
        var specification = new SpecificationBuilder<EmailLog>()
            .Where(emailLog => emailLog.CreatedAt >= request.FromDate &&
                               emailLog.CreatedAt <= request.ToDate).Build();
        var emailLogs = await unitOfWork.EmailLogRepository.GetAllAsync(specification);
        //group data by created date and status
        var groupData = emailLogs.GroupBy(emailLog => new { emailLog.CreatedAt.Date, emailLog.EmailState });
        return groupData.Select(group => new DashboardEmailLogByTimeResponse
        {
            CreatedAt = group.Key.Date,
            EmailState = group.Key.EmailState,
            TotalEmail = group.Count()
        });
    }

    public async Task<DashboardStudentCaredDto?> GetStudentCaredDashboard()
    {
        //get current semester
        var currentSemester = await unitOfWork.SemesterRepository.GetCurrentSemesterAsync() ?? throw new EntityNotFoundException("Current semester not found");
        var studentNeedCares = await unitOfWork.StudentNeedCareRepository.GetAllBySemesterAsync(currentSemester.SemesterName);
        //get previous semester
        var previousSemester = await unitOfWork.SemesterRepository.GetPreviousSemesterAsync(currentSemester) ?? throw new EntityNotFoundException("Previous semester not found");
        var previousStudentNeedCares = await unitOfWork.StudentNeedCareRepository.GetAllBySemesterAsync(previousSemester.SemesterName);
        //Calculate student need care rate
        var previousPeriodDifferenceRate = !previousStudentNeedCares.Any() ? studentNeedCares.Count()
              : (studentNeedCares.Count() - previousStudentNeedCares.Count()) / previousStudentNeedCares.Count();
        return new DashboardStudentCaredDto
        {
            TotalStudentNeedCare = studentNeedCares.Count(),
            PreviousPeriodDifferenceRate = previousPeriodDifferenceRate * 100,
            TotalStudentNotAssigned = studentNeedCares.Count(s => s.CareStatus == CareStatus.NotAssigned),
            TotalStudentDoing = studentNeedCares.Count(s => s.CareStatus == CareStatus.Doing),
            TotalStudentTodo = studentNeedCares.Count(s => s.CareStatus == CareStatus.Todo),
            TotalStudentCared = studentNeedCares.Count(s => s.CareStatus == CareStatus.Done)
        };
    }

    public async Task<DashboardStudentRemindDto> GetStudentRemindDashboard(EmailType emailType)
    {
        //get current semester
        var currentSemester = await unitOfWork.SemesterRepository.GetCurrentSemesterAsync() ?? throw new EntityNotFoundException("Current semester not found");
        var specification = new SpecificationBuilder<EmailLog>()
                 .Where(emailLog => emailLog.SemesterName == currentSemester.SemesterName &&
                                    emailLog.EmailType == emailType).Build();
        var currentAttendanceNoticeCount = await unitOfWork.EmailLogRepository.CountAsync(specification);
        //get previous semester
        var previousSemester = await unitOfWork.SemesterRepository.GetPreviousSemesterAsync(currentSemester) ?? throw new EntityNotFoundException("Previous semester not found");
        specification = new SpecificationBuilder<EmailLog>()
                 .Where(emailLog => emailLog.SemesterName == previousSemester.SemesterName &&
                                    emailLog.EmailType == emailType).Build();
        var previousAttendanceNoticeCount = await unitOfWork.EmailLogRepository.CountAsync(specification);
        //Calculate attendance rate
        var previousPeriodDifferenceRate = previousAttendanceNoticeCount == 0 ? currentAttendanceNoticeCount : (currentAttendanceNoticeCount - previousAttendanceNoticeCount) / previousAttendanceNoticeCount;
        return new DashboardStudentRemindDto
        {
            TotalReminds = currentAttendanceNoticeCount,
            PreviousPeriodDifferenceRate = previousPeriodDifferenceRate * 100
        };
    }

    public async Task<IEnumerable<DashboardStudentRemindByTimeResponse>?> GetStudentReminderByTimeDashboard(DashboardStudentRemindRequest data)
    {
        var specification = new SpecificationBuilder<EmailLog>()
            .Where(emailLog => emailLog.CreatedAt >= data.FromDate &&
                               emailLog.CreatedAt <= data.ToDate &&
                               (data.EmailType == null || emailLog.EmailType == data.EmailType))
            .Build();
        var emailLogs = await unitOfWork.EmailLogRepository.GetAllAsync(specification);
        return emailLogs.GroupBy(emailLog => emailLog.CreatedAt.Date)
          .Select(group => new DashboardStudentRemindByTimeResponse
          {
              CreatedAt = group.Key,
              Total = group.Count()
          });
    }

    public async Task<DashboardTotalApplicationDto?> GetTotalApplicationDashboard()
    {
        //Get all application
        var totalApplications = await unitOfWork.StudentApplicationRepository.GetAllAsync();
        //Get all application type
        var applicationTypes = await unitOfWork.ApplicationTypeRepository.GetAllAsync();
        return new DashboardTotalApplicationDto
        {
            TotalReceivedApplication = totalApplications.Count(a => a.Status == ApplicationStatus.Receive),
            TotalReturnedApplication = totalApplications.Count(a => a.Status == ApplicationStatus.Return),
            ApplicationTypes = applicationTypes.Select(applicationType => new ApplicationTypeResponse
            {
                Id = applicationType.Id,
                EnglishName = applicationType.EnglishName,
                VietnameseName = applicationType.VietnameseName,
                TotalApplications = totalApplications.Count(a => a.ApplicationTypeId == applicationType.Id)
            })
        };
    }

    public async Task<DashboardStudentRemindDto?> GetTotalReminderDashboard()
    {
        //get current semester
        var currentSemester = await unitOfWork.SemesterRepository.GetCurrentSemesterAsync() ?? throw new EntityNotFoundException("Current semester not found");
        var specification = new SpecificationBuilder<EmailLog>()
                 .Where(emailLog => emailLog.SemesterName == currentSemester.SemesterName &&
                 (emailLog.EmailType == EmailType.AttendanceNotification ||
                 emailLog.EmailType == EmailType.DeferNotification ||
                 emailLog.EmailType == EmailType.FailedSubjectNotification)).Build();
        var currentRemindCount = await unitOfWork.EmailLogRepository.CountAsync(specification);
        //get previous semester
        var previousSemester = await unitOfWork.SemesterRepository.GetPreviousSemesterAsync(currentSemester) ?? throw new EntityNotFoundException("Previous semester not found");
        specification = new SpecificationBuilder<EmailLog>()
                 .Where(emailLog => emailLog.SemesterName == previousSemester.SemesterName &&
                 (emailLog.EmailType == EmailType.AttendanceNotification ||
                 emailLog.EmailType == EmailType.DeferNotification ||
                 emailLog.EmailType == EmailType.FailedSubjectNotification)).Build();
        var previousRemindCount = await unitOfWork.EmailLogRepository.CountAsync(specification);
        //Calculate remind rate
        var previousPeriodDifferenceRate = previousRemindCount == 0 ? currentRemindCount : (currentRemindCount - previousRemindCount) / previousRemindCount;
        return new DashboardStudentRemindDto
        {
            TotalReminds = currentRemindCount,
            PreviousPeriodDifferenceRate = previousPeriodDifferenceRate * 100
        };
    }
}
