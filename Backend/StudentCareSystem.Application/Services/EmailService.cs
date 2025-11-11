using System.Text;

using AutoMapper;

using Hangfire;

using Microsoft.EntityFrameworkCore;

using Serilog;

using StudentCareSystem.Application.Commons.Exceptions;
using StudentCareSystem.Application.Commons.Interfaces;
using StudentCareSystem.Application.Commons.Models.Defers;
using StudentCareSystem.Application.Commons.Models.Emails;
using StudentCareSystem.Application.Commons.Utilities;
using StudentCareSystem.Domain.Entities;
using StudentCareSystem.Domain.Enums;
using StudentCareSystem.Domain.Interfaces;
using StudentCareSystem.Infrastructure.ExternalServices;
using StudentCareSystem.Infrastructure.Models.EmailProxies;
using StudentCareSystem.Infrastructure.Specifications;
using StudentCareSystem.Infrastructure.Utilities;


namespace StudentCareSystem.Application.Services;

public class EmailService(
    IMapper mapper,
    IEmailProxyService emailProxyService,
    IUnitOfWork unitOfWork
) : IEmailService
{

    public async Task SendAttendanceNotificationAsync(DateTime dateTime)
    {
        var specification = new SpecificationBuilder<AbsenceRateBoundary>()
            .Include(a => a.Include(a => a.EmailSample))
            .Where(a => a.IsActive)
            .Build();
        var absenceRateBoundaries = await unitOfWork.AbsenceRateBoundaryRepository.GetAllAsync(specification);
        foreach (var absenceRateBoundary in absenceRateBoundaries)
        {
            var emailSample = absenceRateBoundary.EmailSample;
            if (emailSample != null)
            {
                var emailSubSampleNames = StringListConverter.ConvertStringToList(emailSample.EmailSubSampleList);
                var emailSubSampleSpecification = new SpecificationBuilder<EmailSubSample>()
                    .Where(e => emailSubSampleNames.Contains(e.Name))
                    .Build();
                var emailSubSamples = await unitOfWork.EmailSubSampleRepository.GetAllAsync(emailSubSampleSpecification);
                emailSample.EmailSubSamples = [.. emailSubSamples];
            }
            await SendAttendanceNotificationBasedRateAsync(absenceRateBoundary, dateTime);
        }
    }

    /// <summary>
    /// Sends an attendance notification for a specific student attendance record.
    /// </summary>
    /// <param name="studentAttendance">The student attendance record.</param>
    private async Task SendAttendanceNotificationBasedRateAsync(AbsenceRateBoundary absenceRateBoundary, DateTime dateTime)
    {
        var studentSubjectsWithAttendance = await unitOfWork.SubjectRepository.GetAllWithAttendanceAsync();
        var studentSubjectCodes = studentSubjectsWithAttendance.Select(s => s.SubjectCode).ToList();

        var attendanceHistorySpecification = new SpecificationBuilder<AttendanceHistory>()
            .Where(a =>
                a.CreatedAt.Date == dateTime.Date
                && a.NewAbsenceRate >= absenceRateBoundary.MinAbsenceRate
                && a.NewAbsenceRate < absenceRateBoundary.MaxAbsenceRate
            )
            .Include(a => a.Include(a => a.StudentAttendance))
            .UseSplitQueries()
            .OrderByDescending(a => a.CreatedAt)
            .Build();

        var attendanceHistories = await unitOfWork.AttendanceHistoryRepository.GetAllAsync(attendanceHistorySpecification);

        // Perform the filtering in memory
        var filteredAttendanceHistories = attendanceHistories
            .Where(a => studentSubjectCodes.Contains(a.StudentAttendance.SubjectCode))
            .ToList();

        // Extract the latest attendance record for each student
        var latestAttendances = filteredAttendanceHistories
            .GroupBy(a => a.StudentAttendanceId)
            .Select(g => g.OrderByDescending(a => a.CreatedAt).First())
            .ToList();

        // Filter records where the absence rate has increased
        var increasedAbsences = latestAttendances
            .Where(a => a.NewAbsenceRate > a.OldAbsenceRate
                && !a.IsSendEmail
                && a.StudentAttendance != null
                && a.StudentAttendance.StartDate <= dateTime.Date
                && a.StudentAttendance.EndDate >= dateTime.Date
                && !a.StudentAttendance.SkipEmailOnAttendance)
            .ToList();

        var studentAttendanceInIncreasedAbsences = increasedAbsences.Select(a => a.StudentAttendance).ToList();
        // Get the current semester
        var emailSample = absenceRateBoundary.EmailSample;
        if (emailSample != null)
        {
            var groupedAbsences = studentAttendanceInIncreasedAbsences.GroupBy(st => st.StudentCode).ToList();
            foreach (var groupedAbsence in groupedAbsences)
            {
                //TODO: Remove this condition when all email samples are updated
                if (emailSample.EmailSubSamples.Count > 0)
                {
                    await SendStudentAttendanceNotification2Async(groupedAbsence, emailSample);
                }
                else
                {
                    await SendStudentAttendanceNotificationAsync(groupedAbsence, emailSample);
                }
            }
            increasedAbsences.ForEach(a => a.IsSendEmail = true);
            await unitOfWork.AttendanceHistoryRepository.UpdateBulkAsync(increasedAbsences);
        }
        else
        {
            Log.Error("Email sample is null for absence rate boundary with id {AbsenceRateBoundaryId}", absenceRateBoundary.Id);
        }
    }

    private async Task SendStudentAttendanceNotificationAsync(
        IGrouping<string, StudentAttendance> groupedAbsence,
        EmailSample emailSample)
    {
        var student = await unitOfWork.StudentRepository.GetByStudentCodeAsync(groupedAbsence.Key);
        if (student != null)
        {
            var emailLogs = new List<EmailLog>();
            var mergedContent = new StringBuilder();
            foreach (var attendance in groupedAbsence)
            {
                var parameters = DictionaryConverter.ConvertToDictionary(student);
                DictionaryConverter.MergeEntityIntoDictionary<Student, StudentAttendance>(parameters, attendance);
                var emailContent = new StringBuilder(EmailHelper.ReplacePlaceholders(emailSample.Content, parameters));
                emailContent.Append("<hr style='border: 1px solid ; font-weight: bold;'>");
                mergedContent.Append(emailContent);
                emailLogs.Add(new EmailLog
                {
                    EmailType = EmailType.AttendanceNotification,
                    EntityId = attendance.Id,
                    SemesterName = attendance.SemesterName,
                    StudentCode = student.StudentCode,
                    RecipientEmail = student.Email,
                    Subject = emailSample.Subject,
                    Content = emailContent.ToString(),
                    BccEmails = emailSample.BccEmails,
                    CcEmails = emailSample.CcEmails,
                    ReplyToEmail = emailSample.ReplyToEmail,
                });
            }
            //Custom the subject
            var emailSubject = new StringBuilder();
            emailSubject.Append(emailSample.Subject);
            // Add the [#numberOfEmails] to the subject
            emailSubject.Append($" [{groupedAbsence.Count()}]");
            // Add the [dd/MM/yyyy] to the subject based on gmt+7
            emailSubject.Append($" [{DateTime.UtcNow.AddHours(7):dd/MM/yyyy}]");
            var tempEmailLog = new EmailLog();
            await emailProxyService.SendEmailAsync(
                [student.Email],
                mergedContent.ToString(),
                emailSubject.ToString(),
                emailSample,
                tempEmailLog);
            foreach (var emailLog in emailLogs)
            {
                emailLog.IdentifierCode = tempEmailLog.IdentifierCode;
                emailLog.EmailState = tempEmailLog.EmailState;
                emailLog.ErrorMessage = tempEmailLog.ErrorMessage;
            }

            await unitOfWork.EmailLogRepository.AddRangeAsync(emailLogs);
            await unitOfWork.SaveChangesAsync();
        }
        else
        {
            Log.Error("Student is null for student attendance with id {StudentCode}", groupedAbsence.Key);
        }

    }

    private async Task SendStudentAttendanceNotification2Async(
        IGrouping<string, StudentAttendance> groupedAbsence,
        EmailSample emailSample)
    {
        var student = await unitOfWork.StudentRepository.GetByStudentCodeAsync(groupedAbsence.Key);
        if (student != null)
        {
            Dictionary<string, object> datas = [];
            datas.Add(
                EmailType.AttendanceNotification.ToString(),
                DictionaryConverter.ConvertListToDictionary(groupedAbsence)
            );
            var mergedContent = EmailHelper.ReplacePlaceholders(emailSample.Content, DictionaryConverter.ConvertToDictionary(student));
            mergedContent = EmailHelper.ReplaceSubTemplates(mergedContent, emailSample.EmailSubSamples, datas);
            //Custom the subject
            var emailSubject = EmailHelper.GenerateEmailHeader(emailSample.Subject);
            var tempEmailLog = new EmailLog();
            var emailLogs = groupedAbsence.Select(a => new EmailLog
            {
                EmailType = EmailType.AttendanceNotification,
                EntityId = a.Id,
                SemesterName = a.SemesterName,
                StudentCode = a.StudentCode,
                RecipientEmail = student.Email,
                Subject = emailSubject.ToString(),
                Content = mergedContent.ToString(),
                BccEmails = emailSample.BccEmails,
                CcEmails = emailSample.CcEmails,
                ReplyToEmail = emailSample.ReplyToEmail,
            }).ToList();
            await emailProxyService.SendEmailAsync(
                [student.Email],
                mergedContent.ToString(),
                emailSubject.ToString(),
                emailSample,
                tempEmailLog);
            foreach (var emailLog in emailLogs)
            {
                emailLog.IdentifierCode = tempEmailLog.IdentifierCode;
                emailLog.EmailState = tempEmailLog.EmailState;
                emailLog.ErrorMessage = tempEmailLog.ErrorMessage;
            }

            await unitOfWork.EmailLogRepository.AddRangeAsync(emailLogs);
            await unitOfWork.SaveChangesAsync();
        }
        else
        {
            Log.Error("Student is null for student attendance with id {StudentCode}", groupedAbsence.Key);
        }

    }

    public async Task SendStudentDeferAsync(SendDeferEmailDto sendDeferEmailDto)
    {
        var emailSampleSpecification = new SpecificationBuilder<EmailSample>()
            .Where(e => e.Id == sendDeferEmailDto.EmailSampleId
                && e.EmailType == EmailType.DeferNotification)
            .Build();
        var emailSample = await unitOfWork.EmailSampleRepository.FirstOrDefaultAsync(emailSampleSpecification)
            ?? throw new EntityNotFoundException("Email sample not found");
        var studentDeferSpecification = new SpecificationBuilder<StudentDefer>()
            .Where(s =>
                s.DefermentDate.Date >= sendDeferEmailDto.FromDate.Date
                && s.DefermentDate.Date <= sendDeferEmailDto.ToDate.Date
                && s.Status == StudentDeferStatus.Approved
            )
            .Include(s => s.Include(s => s.Student))
            .Build();
        var studentDefers = await unitOfWork.StudentDeferRepository.GetAllAsync(studentDeferSpecification);
        // Get the latest student defers grouped by StudentCode 
        var latestStudentDefers = studentDefers
            .GroupBy(s => s.StudentCode)
            .Select(g => g.OrderByDescending(s => s.DefermentDate).First())
            .ToList();
        foreach (var studentDefer in latestStudentDefers)
        {
            await SendStudentDeferEmailAsync(studentDefer, emailSample);
        }
    }

    private async Task SendStudentDeferEmailAsync(StudentDefer studentDefer, EmailSample emailSample)
    {
        var student = studentDefer.Student;
        if (student != null)
        {
            var parameters = DictionaryConverter.ConvertToDictionary(student);
            DictionaryConverter.MergeEntityIntoDictionary<Student, StudentDefer>(parameters, studentDefer);
            var emailContent = new StringBuilder(EmailHelper.ReplacePlaceholders(emailSample.Content, parameters));
            var emailSubject = new StringBuilder(EmailHelper.GenerateEmailHeader(emailSample.Subject));
            var emailLog = new EmailLog
            {
                EmailType = EmailType.DeferNotification,
                EntityId = studentDefer.Id,
                SemesterName = studentDefer.DeferredSemesterName,
                StudentCode = student.StudentCode,
                RecipientEmail = student.Email,
                Subject = emailSubject.ToString(),
                Content = emailContent.ToString(),
                BccEmails = emailSample.BccEmails,
                CcEmails = emailSample.CcEmails,
                ReplyToEmail = emailSample.ReplyToEmail,
            };
            await emailProxyService.SendEmailAsync(
                [student.Email],
                emailContent.ToString(),
                emailSample.Subject,
                emailSample,
                emailLog);
            await unitOfWork.EmailLogRepository.AddAsync(emailLog);
            await unitOfWork.SaveChangesAsync();
        }
        else
        {
            Log.Error("Student is null for student defer with id {StudentDeferId}", studentDefer.Id);
        }
    }

    public async Task SendFailedSubjectNotificationsAsync(SendFailedSubjectEmailDto sendFailedSubjectEmailDto)
    {
        var emailSample = await unitOfWork.EmailSampleRepository.GetEmailSampleWithSubSamplesAsync(EmailType.FailedSubjectNotification)
                ?? throw new EntityNotFoundException("Email sample not found");
        var studentFailedSubject = await unitOfWork.StudentPointRepository.GetStudentFailedSubjectsBySemesterAsync(sendFailedSubjectEmailDto.SemesterName);

        var studentPointGroups = studentFailedSubject
            .GroupBy(s => s.StudentCode)
            .ToList();

        // Filter out students with no email or already sent email
        studentPointGroups = studentPointGroups
            .Where(g => g.Any(s => !s.IsSendMail))
            .ToList();

        var studentsCode = studentPointGroups.Select(g => g.Key).ToList();

        // Get all students with the specified status codes
        var students = await unitOfWork.StudentRepository.GetAllStudentsInStudentCodesAsync(studentsCode,
        [
            StudentStatus.BL,
            StudentStatus.CO,
            StudentStatus.HD,
            StudentStatus.HL
        ]);
        var studentDict = students.ToDictionary(s => s.StudentCode, s => s);
        List<StudentPoint> studentPointSent = [];
        foreach (var studentPointGroup in studentPointGroups)
        {
            if (studentDict.TryGetValue(studentPointGroup.Key, out var student))
            {
                await SendStudentFailedSubjectNotificationsAsync(studentPointGroup, emailSample, student);
                studentPointSent.AddRange(studentPointGroup);
            }
            else
            {
                Log.Error("Student is null for student point with id {StudentCode}", studentPointGroup.Key);
            }
        }
        if (studentPointSent.Count > 0)
        {
            foreach (var studentPoint in studentPointSent)
            {
                studentPoint.IsSendMail = true;
            }
            await unitOfWork.StudentPointRepository.UpdateBulkAsync(studentPointSent);
        }
    }

    private async Task SendStudentFailedSubjectNotificationsAsync(
        IGrouping<string, StudentPoint> studentPointGroup,
        EmailSample emailSample, Student student)
    {
        Dictionary<string, object> datas = [];
        datas.Add(
            EmailType.FailedSubjectNotification.ToString(),
            DictionaryConverter.ConvertListToDictionary(studentPointGroup)
        );
        var mergedContent = EmailHelper.ReplacePlaceholders(emailSample.Content, DictionaryConverter.ConvertToDictionary(student));
        mergedContent = EmailHelper.ReplaceSubTemplates(mergedContent, emailSample.EmailSubSamples, datas);
        var emailSubject = EmailHelper.GenerateEmailHeader(emailSample.Subject);
        var tempEmailLog = new EmailLog();
        var emailLogs = studentPointGroup.Select(a => new EmailLog
        {
            EmailType = EmailType.FailedSubjectNotification,
            EntityId = a.Id,
            SemesterName = a.SemesterName,
            StudentCode = a.StudentCode,
            RecipientEmail = student.Email,
            Subject = emailSubject,
            Content = mergedContent,
            BccEmails = emailSample.BccEmails,
            CcEmails = emailSample.CcEmails,
            ReplyToEmail = emailSample.ReplyToEmail,
        }).ToList();
        await emailProxyService.SendEmailAsync(
            [student.Email],
            mergedContent,
            emailSubject,
            emailSample,
            tempEmailLog);
        foreach (var emailLog in emailLogs)
        {
            emailLog.IdentifierCode = tempEmailLog.IdentifierCode;
            emailLog.EmailState = tempEmailLog.EmailState;
            emailLog.ErrorMessage = tempEmailLog.ErrorMessage;
        }
        await unitOfWork.EmailLogRepository.AddRangeAsync(emailLogs);
        await unitOfWork.SaveChangesAsync();
    }

    /// <summary>
    /// Resend any failed email notifications from today and change their state to pending.
    /// </summary>
    public async Task ResendEmailFailAsync()
    {
        var specification = new SpecificationBuilder<EmailLog>()
            .Where(e => e.EmailState == EmailState.Failed)
            .Build();

        var emailLogs = await unitOfWork.EmailLogRepository.GetAllAsync(specification);
        var proxyLogIds = new HashSet<string>();
        foreach (var emailLog in emailLogs)
        {
            if (!string.IsNullOrEmpty(emailLog.ProxyLogId))
            {
                proxyLogIds.Add(emailLog.ProxyLogId);
                proxyLogIds.Add(emailLog.ProxyLogId);
            }
            else
            {
                await emailProxyService.SendEmailAsync(
                    emailLog.Subject,
                    emailLog.Content,
                    StringListConverter.ConvertStringToList(emailLog.RecipientEmail),
                    StringListConverter.ConvertStringToList(emailLog.CcEmails),
                    StringListConverter.ConvertStringToList(emailLog.BccEmails),
                    emailLog.ReplyToEmail,
                    emailLog);
            }
            emailLog.EmailState = EmailState.Pending;
        }
        foreach (var proxyLogId in proxyLogIds)
        {
            await emailProxyService.SendEmailAgainAsync(proxyLogId);
            Log.Information("Resending email with ProxyLogId: {ProxyLogId}", proxyLogId);
        }
        await unitOfWork.EmailLogRepository.UpdateBulkAsync(emailLogs);
    }

    public async Task ResendUserEmailFailAsync()
    {
        var specification = new SpecificationBuilder<UserEmailLog>()
            .Where(e => e.EmailState == EmailState.Failed)
            .Build();

        var userEmailLogs = await unitOfWork.UserEmailLogRepository.GetAllAsync(specification);

        var proxyLogIds = new HashSet<string>();

        foreach (var userEmailLog in userEmailLogs)
        {
            if (!string.IsNullOrEmpty(userEmailLog.ProxyLogId))
            {
                proxyLogIds.Add(userEmailLog.ProxyLogId);
                proxyLogIds.Add(userEmailLog.ProxyLogId);
            }
            else
            {
                var emailLog = mapper.Map<EmailLog>(userEmailLog);
                await emailProxyService.SendEmailAsync(
                    userEmailLog.Subject,
                    userEmailLog.Content,
                    StringListConverter.ConvertStringToList(userEmailLog.RecipientEmail),
                    StringListConverter.ConvertStringToList(userEmailLog.CcEmails),
                    StringListConverter.ConvertStringToList(userEmailLog.BccEmails),
                    userEmailLog.ReplyToEmail,
                    emailLog);
            }

            userEmailLog.EmailState = EmailState.Pending;
        }

        // Gửi lại các email có ProxyLogId (nếu có)
        foreach (var proxyLogId in proxyLogIds)
        {
            await emailProxyService.SendEmailAgainAsync(proxyLogId);
        }

        await unitOfWork.UserEmailLogRepository.UpdateBulkAsync(userEmailLogs);
    }


    public async Task CheckEmailStatusAsync()
    {
        // Get all emailLogs which are not sent
        var specification = new SpecificationBuilder<EmailLog>()
            .Where(e => e.EmailState == EmailState.Pending
                // Only check logs created in the last 3 days
                && e.CreatedAt.Date > DateTime.UtcNow.AddDays(-3).Date)
            .Build();
        var emailLogs = await unitOfWork.EmailLogRepository.GetAllAsync(specification);
        var identifierCodes = emailLogs.Select(e => e.IdentifierCode).ToList();
        if (identifierCodes.Count == 0)
        {
            return;
        }
        var emailProxyLogs = new List<EmailProxyLog>();
        foreach (var batch in BatchHelper.Batch(identifierCodes, 300))
        {
            var batchLogs = await emailProxyService.GetEmailLogsByIdentifierCodeAsync(batch);
            if (batchLogs != null)
                emailProxyLogs.AddRange(batchLogs);
        }
        if (emailProxyLogs.Count != 0)
        {
            foreach (var emailLog in emailLogs)
            {
                var emailProxyLog = emailProxyLogs.FirstOrDefault(e => e.IdentifierCode == emailLog.IdentifierCode);
                if (emailProxyLog != null)
                {
                    emailLog.EmailState = emailProxyLog.Status ? EmailState.Sent : EmailState.Failed;
                    emailLog.ProxyLogId = emailProxyLog.Id;
                }
            }
            await unitOfWork.EmailLogRepository.UpdateBulkAsync(emailLogs);
        }
    }

    public async Task CheckUserEmailStatusAsync()
    {
        // Get all userEmailLogs which are not sent
        var specification = new SpecificationBuilder<UserEmailLog>()
            .Where(e => e.EmailState == EmailState.Pending)
            .Build();
        var userEmailLogs = await unitOfWork.UserEmailLogRepository.GetAllAsync(specification);
        var identifierCodes = userEmailLogs.Select(e => e.IdentifierCode).ToList();
        if (identifierCodes.Count == 0)
        {
            return;
        }
        var emailProxyLogs = new List<EmailProxyLog>();
        foreach (var batch in BatchHelper.Batch(identifierCodes, 300))
        {
            var batchLogs = await emailProxyService.GetEmailLogsByIdentifierCodeAsync(batch);
            if (batchLogs != null)
                emailProxyLogs.AddRange(batchLogs);
        }
        if (emailProxyLogs.Count != 0)
        {
            foreach (var userEmailLog in userEmailLogs)
            {
                var emailProxyLog = emailProxyLogs.FirstOrDefault(e => e.IdentifierCode == userEmailLog.IdentifierCode);
                if (emailProxyLog != null)
                {
                    userEmailLog.EmailState = emailProxyLog.Status ? EmailState.Sent : EmailState.Failed;
                    userEmailLog.ProxyLogId = emailProxyLog.Id;
                }
            }
            await unitOfWork.UserEmailLogRepository.UpdateBulkAsync(userEmailLogs);
        }
    }

    public async Task NotifyAdminNumberOfEmailsSentAsync(DateTime dateTime)
    {
        var currentSemsester = await unitOfWork.SemesterRepository.GetCurrentSemesterAsync();
        var emailSampleSpecification = new SpecificationBuilder<EmailSample>()
            .Where(e => e.EmailType == EmailType.EmailStatistics)
            .Build();
        var emailSample = await unitOfWork.EmailSampleRepository.FirstOrDefaultAsync(emailSampleSpecification)
            ?? throw new EntityNotFoundException("Email sample not found");
        var emailSubject = EmailHelper.GenerateEmailHeader(emailSample.Subject);
        var emailCount = await unitOfWork.EmailLogRepository.CountByDateAsync(dateTime);
        var adminEmails = await unitOfWork.UserRepository.GetAllFEEmailInRoleAsync([RoleType.Admin, RoleType.Manager]);
        var emailNotificationCount = new EmailNotificationCount(emailCount, dateTime);
        var parameters = DictionaryConverter.ConvertToDictionary(emailNotificationCount);
        var emailContent = EmailHelper.ReplacePlaceholders(emailSample.Content, parameters);
        var emailLog = new EmailLog
        {
            EmailType = EmailType.EmailStatistics,
            SemesterName = currentSemsester?.SemesterName ?? string.Empty,
            RecipientEmail = StringListConverter.ConvertListToString([.. adminEmails]),
            Subject = emailSubject,
            Content = emailContent,
            BccEmails = emailSample.BccEmails,
            CcEmails = emailSample.CcEmails,
            ReplyToEmail = emailSample.ReplyToEmail,
        };
        await emailProxyService.SendEmailAsync(
            [.. adminEmails],
            emailContent,
            emailSubject,
            emailSample,
            emailLog);
        var userEmailLog = mapper.Map<UserEmailLog>(emailLog);
        await unitOfWork.UserEmailLogRepository.AddAsync(userEmailLog);
        await unitOfWork.SaveChangesAsync();
    }

    public async Task NotifyFailedJobAsync()
    {
        var jobStorage = JobStorage.Current;
        var jobClient = jobStorage.GetMonitoringApi();

        var failedJobCount = jobClient.FailedCount();
        if (failedJobCount == 0)
        {
            return;
        }
        var emailFailedJobCount = new EmailFailedJobCount
        {
            Failed = failedJobCount,
            Date = DateTime.UtcNow.AddHours(7),
        };
        var parameters = DictionaryConverter.ConvertToDictionary(emailFailedJobCount);
        var emailSampleSpecification = new SpecificationBuilder<EmailSample>()
            .Where(e => e.EmailType == EmailType.FailedJobNotification)
            .Build();
        var emailSample = await unitOfWork.EmailSampleRepository.FirstOrDefaultAsync(emailSampleSpecification)
            ?? throw new EntityNotFoundException("Email sample not found");
        var emailSubject = new StringBuilder(EmailHelper.GenerateEmailHeader(emailSample.Subject));
        var emailContent = EmailHelper.ReplacePlaceholders(emailSample.Content, parameters);
        var adminEmails = await unitOfWork.UserRepository.GetAllFEEmailInRoleAsync([RoleType.Admin]);
        var emailLog = new EmailLog
        {
            EmailType = EmailType.FailedJobNotification,
            RecipientEmail = StringListConverter.ConvertListToString([.. adminEmails]),
            Subject = emailSubject.ToString(),
            Content = emailContent,
            BccEmails = emailSample.BccEmails,
            CcEmails = emailSample.CcEmails,
            ReplyToEmail = emailSample.ReplyToEmail,

        };
        await emailProxyService.SendEmailAsync(
            [.. adminEmails],
            emailContent,
            emailSubject.ToString(),
            emailSample,
            emailLog);
    }

    public async Task SendStudentCareSummaryEmails()
    {
        var currentSemester = await unitOfWork.SemesterRepository.GetCurrentSemesterAsync()
            ?? throw new EntityNotFoundException("Current semester not found");
        var studentNeedCareCountDictionary = await unitOfWork.StudentCareAssignmentRepository.GetAssignmentCountByUserBySemestername(currentSemester.SemesterName);
        var emailSampleSpecification = new SpecificationBuilder<EmailSample>()
            .Where(e => e.EmailType == EmailType.StudentNeedCareProgress)
            .Build();
        var emailSample = await unitOfWork.EmailSampleRepository.FirstOrDefaultAsync(emailSampleSpecification)
            ?? throw new EntityNotFoundException("Email sample not found");
        var emailSubject = EmailHelper.GenerateEmailHeader(emailSample.Subject);
        foreach (var kvp in studentNeedCareCountDictionary)
        {
            var user = kvp.Key;
            var studentNeedCareCount = new StudentNeedCareCount(kvp.Value, currentSemester.SemesterName);
            var parameters = DictionaryConverter.ConvertToDictionary(studentNeedCareCount);
            DictionaryConverter.MergeEntityIntoDictionary<StudentNeedCareCount, User>(parameters, user);
            var emailContent = new StringBuilder(EmailHelper.ReplacePlaceholders(emailSample.Content, parameters));
            var emailLog = new EmailLog
            {
                EmailType = EmailType.StudentNeedCareProgress,
                SemesterName = currentSemester.SemesterName,
                RecipientEmail = string.IsNullOrEmpty(user.FeEmail) ? user.Email : user.FeEmail,
                Subject = emailSubject.ToString(),
                Content = emailContent.ToString(),
                BccEmails = emailSample.BccEmails,
                CcEmails = emailSample.CcEmails,
                ReplyToEmail = emailSample.ReplyToEmail,
            };
            await emailProxyService.SendEmailAsync(
                [user.Email],
                emailContent.ToString(),
                emailSubject.ToString(),
                emailSample,
                emailLog);
        }
    }
}
