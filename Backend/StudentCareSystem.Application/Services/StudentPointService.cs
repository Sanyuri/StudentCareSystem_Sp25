using AutoMapper;

using Finbuckle.MultiTenant.Abstractions;

using Microsoft.EntityFrameworkCore;

using StudentCareSystem.Application.Commons.Exceptions;
using StudentCareSystem.Application.Commons.Interfaces;
using StudentCareSystem.Application.Commons.Models.Points;
using StudentCareSystem.Application.Commons.Models.Students;
using StudentCareSystem.Domain.Entities;
using StudentCareSystem.Domain.Enums;
using StudentCareSystem.Domain.Helpers;
using StudentCareSystem.Domain.Interfaces;
using StudentCareSystem.Infrastructure.Cachings;
using StudentCareSystem.Infrastructure.ExternalServices;
using StudentCareSystem.Infrastructure.Models.Tenant;
using StudentCareSystem.Infrastructure.Specifications;
using StudentCareSystem.Infrastructure.Utilities;



namespace StudentCareSystem.Application.Services;

public class StudentPointService(
    IMapper mapper,
    IFapService fapService,
    IRedisCacheService cacheService,
    IStudentRepository studentRepository,
    ISemesterRepository semesterRepository,
    IStudentPointRepository studentPointRepository,
    IMultiTenantContextAccessor<AppTenantInfo> multiTenantContextAccessor

) : IStudentPointService
{

    private readonly string tenantIdentifier = multiTenantContextAccessor.MultiTenantContext?.TenantInfo?.Identifier
        ?? throw new ArgumentNullException(multiTenantContextAccessor.MultiTenantContext?.TenantInfo?.Identifier, "Tenant identifier cannot be null.");

    /// <summary>
    /// Gets all student points with pagination based on the provided filter.
    /// </summary>
    /// <param name="filter">The filter criteria for student points.</param>
    /// <returns>A paginated list of student point DTOs.</returns>
    public async Task<Pagination<GetStudentPointDto>> GetAllWithPaginationAsync(StudentPointFilter filter)
    {
        var query = filter.Query?.Trim();
        var studentPointSpecification = new SpecificationBuilder<StudentPoint>()
            .Where(s =>
                (string.IsNullOrEmpty(query)
                    || s.StudentCode.Contains(query)
                    || (s.Student != null && s.Student.StudentName.Contains(query))
                )
                && (string.IsNullOrEmpty(filter.ClassName) || s.ClassName == filter.ClassName)
                && (!filter.PointStatus.HasValue || s.PointStatus == filter.PointStatus)
                && (!filter.FailReason.HasValue || s.FailReason == filter.FailReason)
                && (string.IsNullOrEmpty(filter.SubjectCode) || s.SubjectCode == filter.SubjectCode)
                && (filter.Semesters == null || !filter.Semesters.Any() || filter.Semesters.Contains(s.SemesterName))
            )
            .Include(s => s.Include(x => x.Student))
            .OrderByDescending(s => s.UpdatedAt ?? s.CreatedAt)
            .ApplyPaging(filter.PageNumber, filter.PageSize)
            .Build();
        var result = await studentPointRepository.GetAllWithPaginationAsync(studentPointSpecification);
        return mapper.Map<Pagination<GetStudentPointDto>>(result);
    }

    /// <summary>
    /// Gets the current failed subjects for a specific student.
    /// </summary>
    /// <param name="studentCode">The student code to search for.</param>
    /// <returns>A collection of failed subject DTOs for the student.</returns>
    /// <exception cref="EntityNotFoundException">Thrown when the student is not found.</exception>
    public async Task<IEnumerable<GetStudentPointDto>> GetCurrentFailedSubjectByStudentCodeAsync(string studentCode)
    {
        if (await studentRepository.GetByStudentCodeAsync(studentCode) is null)
        {
            throw new EntityNotFoundException($"Student with {studentCode} not found");
        }
        var latestFailedSubject = await studentPointRepository.GetDebtSubjectsAsync(studentCode);
        return mapper.Map<IEnumerable<GetStudentPointDto>>(latestFailedSubject);
    }

    /// <summary>
    /// Gets all student points for a specific student in the specified semesters.
    /// </summary>
    /// <param name="studentCode">The student code to search for.</param>
    /// <param name="semesters">The array of semester names to filter by.</param>
    /// <returns>A collection of student point DTOs matching the criteria.</returns>
    public async Task<IEnumerable<GetStudentPointDto>> GetAllStudentPointByStudentCodeAndInSemestersAsync(string studentCode, string[] semesters)
    {
        var studentPointSpecification = new SpecificationBuilder<StudentPoint>()
            .Where(s => s.StudentCode == studentCode && semesters.Contains(s.SemesterName))
            .OrderByDescending(s => s.UpdatedAt ?? s.CreatedAt)
            .Build();
        var result = await studentPointRepository.GetAllAsync(studentPointSpecification);
        return mapper.Map<IEnumerable<GetStudentPointDto>>(result);
    }

    /// <summary>
    /// Scans and updates student point data from the FAP system.
    /// </summary>
    /// <returns>A task representing the asynchronous operation.</returns>
    public async Task ScanStudentPointAsync()
    {
        var studentCode = await studentRepository.GetAllStudentCodeByStatusCodesAsync(
            [StudentStatus.HD, StudentStatus.HL, StudentStatus.CO, StudentStatus.BL]);

        await BatchHelper.ProcessInBatchesAsync(
            studentCode,
            150,
            async (chunk, batchIndex, totalBatches) =>
            {
                var studentPointsFromFap = await fapService.GetStudentPointsAsync(chunk);
                var newStudentPoints = mapper.Map<IEnumerable<StudentPoint>>(studentPointsFromFap);
                var studentPointSpecification = new SpecificationBuilder<StudentPoint>()
                    .Where(s => chunk.Contains(s.StudentCode))
                    .Build();
                var oldStudentPoints = await studentPointRepository.GetAllAsync(studentPointSpecification);
                await ManageStudentPointAsync(newStudentPoints, oldStudentPoints);
            }
            , "Student Point Scan"
            );
    }

    private async Task ManageStudentPointAsync(IEnumerable<StudentPoint> newStudentPoints, IEnumerable<StudentPoint> oldStudentPoints)
    {
        var studentPointsToInsert = new List<StudentPoint>();
        var studentPointsToUpdate = new List<StudentPoint>();
        var studentPointsToDelete = new List<StudentPoint>();

        // Update the dictionary key to include SemesterName
        var oldStudentPointDict = oldStudentPoints.ToDictionary(
            s => (s.StudentCode, s.SubjectCode, s.ClassName, s.StartDate, s.SemesterName),
            s => s
        );

        foreach (var newStudentPoint in newStudentPoints)
        {
            // Update the key lookup to include SemesterName
            if (oldStudentPointDict.TryGetValue((
                newStudentPoint.StudentCode,
                newStudentPoint.SubjectCode,
                newStudentPoint.ClassName,
                newStudentPoint.StartDate,
                newStudentPoint.SemesterName), out var oldStudentPoint))
            {
                oldStudentPoint.StudentCode = newStudentPoint.StudentCode;
                oldStudentPoint.PointStatus = newStudentPoint.PointStatus;
                oldStudentPoint.AverageMark = newStudentPoint.AverageMark;
                oldStudentPoint.IsExempt = newStudentPoint.IsExempt;
                oldStudentPoint.PointStatus = newStudentPoint.PointStatus;
                oldStudentPoint.IsPassWith = newStudentPoint.IsPassWith;
                oldStudentPoint.StartDate = newStudentPoint.StartDate;
                oldStudentPoint.EndDate = newStudentPoint.EndDate;
                oldStudentPoint.SemesterName = newStudentPoint.SemesterName; // Also update SemesterName
                studentPointsToUpdate.Add(oldStudentPoint);
            }
            else
            {
                studentPointsToInsert.Add(newStudentPoint);
            }
        }

        // Update the new student points dictionary key to include SemesterName
        var newStudentPointDict = newStudentPoints.ToDictionary(
            s => (s.StudentCode, s.SubjectCode, s.ClassName, s.StartDate, s.SemesterName),
            s => s
        );

        foreach (var oldStudentPoint in oldStudentPoints)
        {
            // Update the key comparison to include SemesterName
            if (!newStudentPointDict.ContainsKey((
                oldStudentPoint.StudentCode,
                oldStudentPoint.SubjectCode,
                oldStudentPoint.ClassName,
                oldStudentPoint.StartDate,
                oldStudentPoint.SemesterName)))
            {
                studentPointsToDelete.Add(oldStudentPoint);
            }
        }

        await studentPointRepository.AddBulkAsync(studentPointsToInsert);
        await studentPointRepository.UpdateBulkAsync(studentPointsToUpdate);
        await studentPointRepository.DeleteBulkAsync(studentPointsToDelete);
    }

    /// <summary>
    /// Gets the last updated date of student points in the system.
    /// </summary>
    /// <returns>The date when student point data was last updated, or null if no data exists.</returns>
    public async Task<DateTime?> GetLastUpdatedDateAsync()
    {
        var specification = new SpecificationBuilder<StudentPoint>()
            .OrderByDescending(s => s.UpdatedAt ?? s.CreatedAt)
            .Build();
        var studentDefer = await studentPointRepository.FirstOrDefaultAsync(specification);
        return studentDefer?.UpdatedAt ?? studentDefer?.CreatedAt;
    }

    /// <summary>
    /// Gets all student codes by their status and tenant identifier.
    /// </summary>
    /// <param name="statusCodes">The collection of student status codes to filter by.</param>
    /// <param name="tenantId">The tenant identifier to filter by.</param>
    /// <returns>A collection of student codes matching the specified status and tenant.</returns>
    private async Task<IEnumerable<string>> GetStudentCodeByStatusAndTenantAsync(
        IEnumerable<StudentStatus> statusCodes, string tenantId)
    {
        var cacheKey = $"StudentCodeByStatusAndTenant_{string.Join("_", statusCodes)}_{tenantId}";
        var cachedResult = await cacheService.GetTAsync<IEnumerable<string>>(cacheKey);
        if (cachedResult != null)
        {
            return cachedResult;
        }
        var studentCodes = await studentRepository.GetAllStudentCodeByStatusCodesAsync(statusCodes);
        await cacheService.SetAsync(cacheKey, studentCodes, TimeSpan.FromHours(1));
        return studentCodes;
    }

    public async Task<Pagination<GetStudentFailedDto>> GetStudentsWithFailedSubjectsAsync(StudentFailedFilter filter)
    {
        // Check the semster 
        var semesterSpecification = new SpecificationBuilder<Semester>()
            .Where(s => s.SemesterName == filter.FromSemester)
            .Build();
        var semester = await semesterRepository.FirstOrDefaultAsync(semesterSpecification)
            ?? throw new EntityNotFoundException($"Semester '{filter.FromSemester}' not found.");

        var result = await studentPointRepository.GetFailedSubjectsByStudentAsync(
            semester, filter.PageNumber, filter.PageSize);
        var items = result.Items.Select(item => new GetStudentFailedDto
        {
            Student = mapper.Map<GetStudentDto>(item.Item1),
            StudentCode = item.Item1.StudentCode,
            SubjectCode = item.Item2,
            FailedSemesters = item.Item3,
            PassedSemesters = item.Item4
        }).ToList();

        return new Pagination<GetStudentFailedDto>
        {
            Items = items,
            PageIndex = result.PageIndex,
            PageSize = result.PageSize,
            TotalItems = result.TotalItems
        };
    }

}
