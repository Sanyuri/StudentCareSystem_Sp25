using AutoMapper;

using Finbuckle.MultiTenant.Abstractions;

using Microsoft.EntityFrameworkCore;

using Serilog;

using StudentCareSystem.Application.Commons.Interfaces;
using StudentCareSystem.Application.Commons.Models.Attendances;
using StudentCareSystem.Domain.Entities;
using StudentCareSystem.Domain.Enums;
using StudentCareSystem.Domain.Helpers;
using StudentCareSystem.Domain.Interfaces;
using StudentCareSystem.Infrastructure.ExternalServices;
using StudentCareSystem.Infrastructure.Models.Tenant;
using StudentCareSystem.Infrastructure.Specifications;
using StudentCareSystem.Infrastructure.Utilities;

namespace StudentCareSystem.Application.Services;

public class StudentAttendanceService(
    IMapper mapper,
    IFapService fapService,
    IMultiTenantContextAccessor<AppTenantInfo> tenantContextAccessor,
    IUnitOfWork unitOfWork
) : IStudentAttendanceService
{
    private readonly AppTenantInfo tenantInfo = tenantContextAccessor.MultiTenantContext?.TenantInfo
                                                ?? throw new ArgumentNullException(nameof(tenantContextAccessor));

    /// <summary>
    /// Gets all student attendances with pagination.
    /// </summary>
    /// <param name="filter">The attendance filter.</param>
    /// <returns>A paginated list of student attendances.</returns>
    public async Task<Pagination<GetStudentAttendanceDto>> GetAllWithPaginationAsync(AttendanceFilter filter)
    {
        var query = filter.Query?.Trim();
        var specification = new SpecificationBuilder<StudentAttendance>()
            .Where(a =>
                (string.IsNullOrEmpty(query)
                 || a.StudentCode.Contains(query)
                 || (a.Student != null && a.Student.StudentName.Contains(query))
                )
                && (!filter.MinAbsenceRate.HasValue || a.AbsenceRate >= filter.MinAbsenceRate)
                && (!filter.MaxAbsenceRate.HasValue || a.AbsenceRate <= filter.MaxAbsenceRate)
                && (!filter.TotalSlots.HasValue || a.TotalSlots == filter.TotalSlots)
                && (!filter.IsIncreased.HasValue || a.IsIncreased == filter.IsIncreased)
                && (!filter.From.HasValue || ((a.UpdatedAt ?? a.CreatedAt).Date >= filter.From.Value.Date))
                && (!filter.To.HasValue || ((a.UpdatedAt ?? a.CreatedAt).Date <= filter.To.Value.Date))
                && (string.IsNullOrEmpty(filter.ClassName) || a.ClassName == filter.ClassName)
                && (string.IsNullOrEmpty(filter.SubjectCode) || a.SubjectCode == filter.SubjectCode)
                && (a.Student == null || (
                    (!filter.CurrentTermNo.HasValue || a.Student.CurrentTermNo == filter.CurrentTermNo)
                    && (string.IsNullOrEmpty(filter.Major) || a.Student.Major == filter.Major)
                ))
                && (!filter.TotalAbsences.HasValue || a.TotalAbsences == filter.TotalAbsences)
            )
            .OrderByDescending(a => a.UpdatedAt ?? a.CreatedAt)
            .ApplyPaging(filter.PageNumber, filter.PageSize)
            .UseSplitQueries()
            .Include(a => a.Include(a => a.Student))
            .Build();

        var result = await unitOfWork.StudentAttendanceRepository.GetAllWithPaginationAsync(specification);
        return mapper.Map<Pagination<GetStudentAttendanceDto>>(result);
    }

    /// <summary>
    /// Gets all attendance notifications by date with pagination.
    /// </summary>
    /// <param name="filter">The export by date filter.</param>
    /// <returns>A paginated list of attendance notifications.</returns>
    public async Task<Pagination<GetStudentAttendanceDto>> GetAllNotificationByDateWithPaginationAsync(
        ExportByDateFilter filter)
    {
        var specification = filter.DateType switch
        {
            Datetype.Date => new SpecificationBuilder<EmailLog>()
                .Where(a => a.CreatedAt.Date == filter.Date.Date
                    && a.EmailType == EmailType.AttendanceNotification)
                .OrderByDescending(a => a.CreatedAt)
                .ApplyPaging(filter.PageNumber, filter.PageSize)
                .Build(),
            Datetype.Month => new SpecificationBuilder<EmailLog>()
                .Where(a => a.CreatedAt.Month == filter.Date.Month && a.CreatedAt.Year == filter.Date.Year &&
                            a.EmailType == EmailType.AttendanceNotification)
                .OrderByDescending(a => a.CreatedAt)
                .ApplyPaging(filter.PageNumber, filter.PageSize)
                .Build(),
            Datetype.Year => new SpecificationBuilder<EmailLog>()
                .Where(a => a.CreatedAt.Year == filter.Date.Year && a.EmailType == EmailType.AttendanceNotification)
                .OrderByDescending(a => a.CreatedAt)
                .ApplyPaging(filter.PageNumber, filter.PageSize)
                .Build(),
            _ => throw new ArgumentOutOfRangeException(nameof(filter), "Invalid date type specified.")
        };

        return await GetAllPaginationByEmailLog(specification);
    }

    /// <summary>
    /// Gets all attendance notifications by semester with pagination.
    /// </summary>
    /// <param name="filter">The export by semester filter.</param>
    /// <returns>A paginated list of attendance notifications.</returns>
    public async Task<Pagination<GetStudentAttendanceDto>> GetAllNotificationBySemesterWithPaginationAsync(
        ExportBySemesterFilter filter)

    {
        var emailLogSpecification = new SpecificationBuilder<EmailLog>()
            .Where(a => a.SemesterName == filter.SemesterName
                        && a.EmailType == EmailType.AttendanceNotification
                        && (!filter.IsEnglish.HasValue || a.Student == null ||
                            (filter.IsEnglish == true && a.Student.CurrentTermNo <= 0) ||
                            (filter.IsEnglish == false && a.Student.CurrentTermNo > 0)))
            .OrderByDescending(a => a.CreatedAt)
            .ApplyPaging(filter.PageNumber, filter.PageSize)
            .Build();

        return await GetAllPaginationByEmailLog(emailLogSpecification);
    }

    /// <summary>
    /// Gets all paginated email logs.
    /// </summary>
    /// <param name="specification">The email log specification.</param>
    /// <returns>A paginated list of email logs.</returns>
    private async Task<Pagination<GetStudentAttendanceDto>> GetAllPaginationByEmailLog(
        ISpecification<EmailLog> specification)
    {
        var emailLogs = await unitOfWork.EmailLogRepository.GetAllWithPaginationAsync(specification);
        var studentAttendanceIds = emailLogs.Items
            .Where(a => a.EntityId != null)
            .Select(a => a.EntityId)
            .ToList();
        ICollection<StudentAttendance> studentAttendances = [];
        foreach (var studentAttendanceId in studentAttendanceIds)
        {
            if (studentAttendanceId == null)
            {
                continue;
            }
            var studentAttendance = await GetStudentAttendanceByIdAsync(studentAttendanceId.Value);
            if (studentAttendance != null)
            {
                studentAttendances.Add(studentAttendance);
            }
        }
        var result = mapper.Map<ICollection<GetStudentAttendanceDto>>(studentAttendances);
        return new Pagination<GetStudentAttendanceDto>
        {
            Items = result,
            TotalItems = emailLogs.TotalItems,
            PageIndex = emailLogs.PageIndex,
            PageSize = emailLogs.PageSize
        };
    }

    /// <summary>
    /// Gets a student attendance by ID.
    /// </summary>
    /// <param name="guid">The student attendance ID.</param>
    /// <returns>The student attendance.</returns>
    private async Task<StudentAttendance?> GetStudentAttendanceByIdAsync(Guid guid)
    {
        var specification = new SpecificationBuilder<StudentAttendance>()
            .Where(a => a.Id == guid)
            .Include(a => a.Include(a => a.Student))
            .Build();
        return await unitOfWork.StudentAttendanceRepository.FirstOrDefaultAsync(specification);
    }

    /// <summary>
    /// Gets all student attendance by student code and in semesters.
    /// </summary>
    /// <param name="studentCode">The student code.</param>
    /// <param name="semesters">The semesters.</param>
    /// <returns>A list of student attendance DTOs.</returns>
    public async Task<IEnumerable<GetStudentAttendanceDto>> GetAllStudentAttendanceByStudentCodeAndInSemestersAsync(string studentCode, string[] semesters)
    {
        var specification = new SpecificationBuilder<StudentAttendance>()
            .Where(a => a.StudentCode == studentCode && semesters.Contains(a.SemesterName))
            .OrderByDescending(a => a.UpdatedAt ?? a.CreatedAt)
            .Build();
        var result = await unitOfWork.StudentAttendanceRepository.GetAllAsync(specification);
        return mapper.Map<IEnumerable<GetStudentAttendanceDto>>(result);
    }

    /// <summary>
    /// Gets the last updated date of student attendance.
    /// </summary>
    /// <returns>The last updated date.</returns>
    public async Task<DateTime?> GetLastUpdatedDateAsync()
    {
        var specification = new SpecificationBuilder<StudentAttendance>()
            .OrderByDescending(a => a.UpdatedAt ?? a.CreatedAt)
            .Build();
        var studentAttendance = await unitOfWork.StudentAttendanceRepository.FirstOrDefaultAsync(specification);
        return studentAttendance?.UpdatedAt ?? studentAttendance?.CreatedAt;
    }

    /// <summary>
    /// Alternative version of ScanStudentAttendanceAsync that processes student attendance updates in chunks 
    /// without accumulating all new records in memory at once.
    /// </summary>
    /// <param name="selectedSemester">The semester for which attendance data is scanned.</param>
    /// <returns>A task representing the asynchronous operation.</returns>
    public async Task ScanStudentAttendanceAsync(Semester selectedSemester)
    {
        var startDate = selectedSemester.StartDate;
        startDate = tenantInfo.IsException ? startDate.AddMonths(-1) : startDate;
        var endDate = selectedSemester.EndDate;
        var studentCodes = await unitOfWork.StudentRepository.GetAllStudentCodeByStatusCodesAsync(
                [StudentStatus.HD, StudentStatus.HL, StudentStatus.CO, StudentStatus.BL]);

        await BatchHelper.ProcessInBatchesAsync(
            studentCodes,
            150,
            async (chunk, batchIndex, totalBatches) =>
            {
                var studentAttendancesFromFap = await fapService.GetAttendancesAsync(startDate, endDate, chunk);
                List<StudentAttendance> newStudentAttendances = mapper.Map<List<StudentAttendance>>(studentAttendancesFromFap);
                var studentSubjects = await unitOfWork.StudentSubjectRepository.GetStudentSubjectsAsync(chunk, startDate);
                newStudentAttendances.ForEach(a =>
                {
                    a.SemesterName = selectedSemester.SemesterName;
                    a.UpdatedAt = selectedSemester.IsCurrentSemester ? null : selectedSemester.EndDate;
                });
                var specification = new SpecificationBuilder<StudentAttendance>()
                    .Where(a =>
                        ((a.UpdatedAt.HasValue ? a.UpdatedAt.Value.Date : a.CreatedAt.Date) >= startDate.Date)
                        && ((a.UpdatedAt.HasValue ? a.UpdatedAt.Value.Date : a.CreatedAt.Date) <= endDate.Date)
                        && chunk.Contains(a.StudentCode)
                    )
                    .Build();
                var studentAttendancesFromDb = await unitOfWork.StudentAttendanceRepository.GetAllAsync(specification);
                await ManageStudentAttendanceToDatabase(newStudentAttendances, studentAttendancesFromDb, studentSubjects);
            },
            "Student Attendance Scan"
        );
    }

    /// <summary>
    /// Manages the synchronization of new student attendance data with the database, handling resets, additions, and updates.
    /// </summary>
    /// <param name="newStudentAttendances">The list of new attendance records from an external source.</param>
    /// <param name="studentAttendancesFromDb">The existing attendance records from the database.</param>
    /// <returns>A task representing the asynchronous operation.</returns>
    private async Task ManageStudentAttendanceToDatabase(
    List<StudentAttendance> newStudentAttendances,
    IEnumerable<StudentAttendance> studentAttendancesFromDb,
    IEnumerable<StudentSubject> studentSubjects)
    {
        List<StudentAttendance> studentAttendancesForManage = [];

        // Chuyển đổi studentSubjectsFrom thành Dictionary để tra cứu nhanh
        var studentSubjectsDict = studentSubjects.ToDictionary(
            a => (a.StudentCode, a.SubjectCode, a.ClassName, a.StartDate), a => a
        );

        foreach (var newStudentAttendance in newStudentAttendances)
        {
            if (studentSubjectsDict.TryGetValue(
                    (newStudentAttendance.StudentCode,
                    newStudentAttendance.SubjectCode,
                    newStudentAttendance.ClassName,
                    newStudentAttendance.StartDate),
                    out var studentSubject))
            {
                if (studentSubject.IsCancelled || !studentSubject.IsCheckFinance)
                {
                    newStudentAttendance.SkipEmailOnAttendance = true;
                }
            }
            else
            {
                newStudentAttendance.SkipEmailOnAttendance = true;
            }
            studentAttendancesForManage.Add(newStudentAttendance);
        }

        // Chuyển đổi thành HashSet để kiểm tra tồn tại nhanh hơn
        var studentAttendanceSet = studentAttendancesForManage
            .Select(b => (b.StudentCode, b.SubjectCode, b.ClassName, b.StartDate))
            .ToHashSet();

        var studentAttendancesToReset = new List<StudentAttendance>();
        var studentAttendancesToUpdate = new List<StudentAttendance>();

        foreach (var studentAttendance in studentAttendancesFromDb)
        {
            var key = (studentAttendance.StudentCode,
                studentAttendance.SubjectCode,
                studentAttendance.ClassName,
                studentAttendance.StartDate);

            if (!studentAttendanceSet.Contains(key))
            {
                studentAttendancesToReset.Add(studentAttendance);
            }
            else
            {
                studentAttendancesToUpdate.Add(studentAttendance);
            }
        }

        // Lọc các bản ghi cần thêm (có trong danh sách mới nhưng không có trong DB)
        var studentAttendancesFromDbSet = studentAttendancesFromDb
            .Select(b => (b.StudentCode, b.SubjectCode, b.ClassName, b.StartDate))
            .ToHashSet();

        List<StudentAttendance> studentAttendancesToAdd = [.. studentAttendancesForManage.Where(
            a => !studentAttendancesFromDbSet.Contains((a.StudentCode, a.SubjectCode, a.ClassName, a.StartDate)))];

        // Gọi các hàm xử lý
        await ResetStudentAttendanceToDatabase(studentAttendancesToReset);
        await AddStudentAttendanceToDataBase(studentAttendancesToAdd);
        await UpdateStudentAttendanceToDataBase(studentAttendancesToUpdate, newStudentAttendances);
    }


    /// <summary>
    /// Adds new student attendance records to the database, initializing their attendance history.
    /// </summary>
    /// <param name="studentAttendances">The list of new attendance records to add.</param>
    /// <returns>A task representing the asynchronous operation.</returns>
    private async Task AddStudentAttendanceToDataBase(List<StudentAttendance> studentAttendances)
    {
        foreach (var studentAttendance in studentAttendances)
        {
            studentAttendance.IsIncreased = true;
            studentAttendance.AttendanceHistories.Add(new AttendanceHistory
            {
                NewAbsenceRate = studentAttendance.AbsenceRate,
                NewTotalAbsences = studentAttendance.TotalAbsences,
                OldAbsenceRate = 0,
                OldTotalAbsences = 0,
                StudentAttendance = studentAttendance,
            });
        }

        await unitOfWork.StudentAttendanceRepository.AddRangeAsync(studentAttendances);
        await unitOfWork.SaveChangesAsync();
    }

    /// <summary>
    /// Updates existing student attendance records in the database with new data and logs changes in attendance history.
    /// </summary>
    /// <param name="oldStudentAttendances">The existing attendance records to update.</param>
    /// <param name="newStudentAttendances">The new attendance data to apply.</param>
    /// <returns>A task representing the asynchronous operation.</returns>
    private async Task UpdateStudentAttendanceToDataBase(
    List<StudentAttendance> oldStudentAttendances,
    List<StudentAttendance> newStudentAttendances)
    {
        var studentAttendanceDict = newStudentAttendances.ToDictionary(
            a => (a.StudentCode, a.SubjectCode, a.ClassName, a.StartDate)
        );

        List<StudentAttendance> studentAttendancesToUpdate = [];
        List<AttendanceHistory> attendanceHistories = [];

        foreach (var oldStudentAttendance in oldStudentAttendances)
        {
            if (studentAttendanceDict.TryGetValue(
                    (oldStudentAttendance.StudentCode,
                    oldStudentAttendance.SubjectCode,
                    oldStudentAttendance.ClassName,
                    oldStudentAttendance.StartDate),
                    out var studentAttendanceFromList))
            {
                // Kiểm tra điều kiện trước khi thay đổi giá trị
                if (oldStudentAttendance.TotalAbsences == studentAttendanceFromList.TotalAbsences)
                {
                    if (oldStudentAttendance.SkipEmailOnAttendance != studentAttendanceFromList.SkipEmailOnAttendance)
                    {
                        oldStudentAttendance.SkipEmailOnAttendance = studentAttendanceFromList.SkipEmailOnAttendance;
                        studentAttendancesToUpdate.Add(oldStudentAttendance);
                    }
                    continue;
                }

                if (oldStudentAttendance.SemesterName != studentAttendanceFromList.SemesterName
                    && oldStudentAttendance.AbsenceRate > studentAttendanceFromList.AbsenceRate)
                {
                    continue;
                }

                attendanceHistories.Add(new AttendanceHistory
                {
                    OldAbsenceRate = oldStudentAttendance.AbsenceRate,
                    OldTotalAbsences = oldStudentAttendance.TotalAbsences,
                    NewAbsenceRate = studentAttendanceFromList.AbsenceRate,
                    NewTotalAbsences = studentAttendanceFromList.TotalAbsences,
                    StudentAttendanceId = oldStudentAttendance.Id
                });

                // Chỉ thay đổi giá trị sau khi đã kiểm tra điều kiện
                oldStudentAttendance.IsIncreased = oldStudentAttendance.TotalAbsences < studentAttendanceFromList.TotalAbsences;
                oldStudentAttendance.SemesterName = studentAttendanceFromList.SemesterName;
                oldStudentAttendance.AbsenceRate = studentAttendanceFromList.AbsenceRate;
                oldStudentAttendance.TotalAbsences = studentAttendanceFromList.TotalAbsences;
                oldStudentAttendance.SkipEmailOnAttendance = studentAttendanceFromList.SkipEmailOnAttendance;
                studentAttendancesToUpdate.Add(oldStudentAttendance);
            }
        }

        await unitOfWork.AttendanceHistoryRepository.AddBulkAsync(attendanceHistories);
        await unitOfWork.StudentAttendanceRepository.UpdateBulkAsync(studentAttendancesToUpdate);
    }

    /// <summary>
    /// Resets student attendance records in the database to zero absences and logs the change in history.
    /// </summary>
    /// <param name="studentAttendances">The list of attendance records to reset.</param>
    /// <returns>A task representing the asynchronous operation.</returns>
    private async Task ResetStudentAttendanceToDatabase(List<StudentAttendance> studentAttendances)
    {
        List<AttendanceHistory> attendanceHistories = [];
        List<StudentAttendance> updatedStudentAttendances = [];
        foreach (var studentAttendance in studentAttendances)
        {
            if (Math.Abs(studentAttendance.AbsenceRate) < 0.0001 && Math.Abs(studentAttendance.TotalAbsences) < 0.0001)
            {
                continue;
            }
            studentAttendance.AbsenceRate = 0;
            studentAttendance.TotalAbsences = 0;
            studentAttendance.IsIncreased = false;
            updatedStudentAttendances.Add(studentAttendance);
            attendanceHistories.Add(new AttendanceHistory
            {
                NewAbsenceRate = 0,
                NewTotalAbsences = 0,
                OldAbsenceRate = studentAttendance.AbsenceRate,
                OldTotalAbsences = studentAttendance.TotalAbsences,
                StudentAttendanceId = studentAttendance.Id
            });
        }
        await unitOfWork.StudentAttendanceRepository.UpdateBulkAsync(updatedStudentAttendances);
        await unitOfWork.AttendanceHistoryRepository.AddBulkAsync(attendanceHistories);
    }

    /// <summary>
    /// Retrieves a paginated list of student attendance records updated or created on a specific date.
    /// </summary>
    /// <param name="filter">The filter specifying the date to query.</param>
    /// <returns>A paginated result of student attendance DTOs.</returns>
    public async Task<Pagination<GetStudentAttendanceDto>> GetAllUpdatedByDateWithPaginationAsync(
        ExportByDateFilter filter)
    {
        var attendanceSpecification = new SpecificationBuilder<StudentAttendance>()
            .Where(a =>
                a.CreatedAt.Date == filter.Date.Date ||
                a.UpdatedAt != null && a.UpdatedAt.Value.Date == filter.Date.Date)
            .OrderByDescending(a => a.UpdatedAt ?? a.CreatedAt)
            .ApplyPaging(filter.PageNumber, filter.PageSize)
            .Include(a => a.Include(a => a.Student))
            .Build();
        var result = await unitOfWork.StudentAttendanceRepository.GetAllWithPaginationAsync(attendanceSpecification);
        return mapper.Map<Pagination<GetStudentAttendanceDto>>(result);
    }
}
