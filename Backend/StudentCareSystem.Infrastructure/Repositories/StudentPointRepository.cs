using System.Linq;

using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

using StudentCareSystem.Domain.Entities;
using StudentCareSystem.Domain.Enums;
using StudentCareSystem.Domain.Helpers;
using StudentCareSystem.Domain.Interfaces;
using StudentCareSystem.Infrastructure.Data;

namespace StudentCareSystem.Infrastructure.Repositories;

/// <summary>
/// Repository for operations related to <see cref="StudentPoint"/>.
/// Implements unit-of-work behaviors and custom queries for student points.
/// </summary>
public class StudentPointRepository(ScsDbContext context, IHttpContextAccessor httpContext)
 : BaseRepository<StudentPoint>(context, httpContext), IStudentPointRepository
{
    private readonly ScsDbContext _context = context;

    /// <summary>
    /// Get the latest point records for subjects the given student is owing (failed).
    /// </summary>
    /// <param name="studentCode">Student code to filter by.</param>
    /// <returns>Enumerable of <see cref="StudentPoint"/> representing debt subjects.</returns>
    public async Task<IEnumerable<StudentPoint>> GetDebtSubjectsAsync(string studentCode)
    {
        return await _context.StudentPoints
            .FromSql($@"
                SELECT sp.*
                FROM StudentPoints sp
                INNER JOIN (
                    SELECT SubjectCode, MAX(EndDate) AS LatestEndDate
                    FROM StudentPoints
                    WHERE StudentCode = {studentCode}
                    GROUP BY SubjectCode
                ) t ON sp.SubjectCode = t.SubjectCode 
                   AND sp.EndDate = t.LatestEndDate
                INNER JOIN Students s 
                    ON sp.StudentCode = s.StudentCode
                WHERE sp.StudentCode = {studentCode}
                  AND sp.PointStatus = 'Fail'
                  AND sp.IsDeleted = 0")
            .ToListAsync();
    }

    /// <summary>
    /// Get failed subject records for a specific semester.
    /// </summary>
    /// <param name="semesterName">Semester name used to filter student points.</param>
    /// <returns>Enumerable of <see cref="StudentPoint"/> records that are failed in the semester.</returns>
    public async Task<IEnumerable<StudentPoint>> GetStudentFailedSubjectsBySemesterAsync(string semesterName)
    {

        return await _context.StudentPoints
            .FromSql($@"
            SELECT sp.*
            FROM StudentPoints sp
            INNER JOIN (
                SELECT StudentCode, SubjectCode, MAX(EndDate) AS LatestEndDate
                FROM StudentPoints
                WHERE SemesterName = {semesterName}
                GROUP BY StudentCode, SubjectCode
            ) t ON sp.StudentCode = t.StudentCode 
               AND sp.SubjectCode = t.SubjectCode 
               AND sp.EndDate = t.LatestEndDate
            WHERE sp.PointStatus = 'Fail'")
            .ToListAsync();
    }

    /// <summary>
    /// Get paged list of students and their failed subjects since <paramref name="fromSemester"/>.
    /// Returns tuples of (Student, SubjectCode, FailedSemesters, PassedSemesters).
    /// </summary>
    /// <param name="fromSemester">Semester to use as lower bound (StartDate) for consideration.</param>
    /// <param name="pageNumber">1-based page index.</param>
    /// <param name="pageSize">Number of items per page.</param>
    /// <returns>Pagination of tuples: Student, SubjectCode, FailedSemesters, PassedSemesters.</returns>
    public async Task<Pagination<(Student, string, string, string)>> GetFailedSubjectsByStudentAsync(Semester fromSemester, int pageNumber, int pageSize)
    {
        // The first string is failed Semester list, the second string is failed Subject list
        // Convert semester to start date for filtering
        var startDate = fromSemester.StartDate;
        List<StudentStatus> studentStatuses = [StudentStatus.HD, StudentStatus.HL, StudentStatus.CO, StudentStatus.BL];

        // Get total count for pagination
        var firstQuery = await _context.StudentPoints
            .Where(s => s.PointStatus == PointStatus.Fail
                && s.StartDate > startDate
                && !s.IsDeleted
                && studentStatuses.Contains(s.Student.StatusCode))
            .Select(s => new { s.StudentCode, s.SubjectCode, s.Student })
            .Distinct()
            .ToListAsync();
        var totalCount = firstQuery.Count;

        var pagedPairs = firstQuery
            .OrderBy(x => x.StudentCode)
            .ThenBy(x => x.SubjectCode)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToList();

        // Extract student codes and subject codes for better query translation
        var studentCodes = pagedPairs.Select(p => p.StudentCode).Distinct().ToList();
        var subjectCodes = pagedPairs.Select(p => p.SubjectCode).Distinct().ToList();

        // Fetch all relevant student points in a single query that EF Core can translate
        var allStudentPoints = await _context.StudentPoints
            .Where(sp => studentCodes.Contains(sp.StudentCode) &&
                         subjectCodes.Contains(sp.SubjectCode) &&
                         sp.StartDate > startDate &&
                         !sp.IsDeleted)
            .Select(sp => new
            {
                sp.StudentCode,
                sp.SubjectCode,
                sp.SemesterName,
                sp.ClassName,
                sp.PointStatus
            })
            .ToListAsync();

        // Filter on the client side to match exact (StudentCode, SubjectCode) pairs
        var filteredPoints = allStudentPoints
            .Where(sp => pagedPairs.Any(p =>
                p.StudentCode == sp.StudentCode &&
                p.SubjectCode == sp.SubjectCode))
            .ToList();

        // 3. Group by student code and subject code
        var grouped = filteredPoints
            .GroupBy(sp => new { sp.StudentCode, sp.SubjectCode })
            .ToDictionary(g => g.Key, g => g.ToList());

        // 4. Process each pair from `pagedPairs`
        var result = new List<(Student, string, string, string)>();

        foreach (var pair in pagedPairs)
        {
            var key = new { pair.StudentCode, pair.SubjectCode };

            if (!grouped.TryGetValue(key, out var points))
                continue;

            var failedSemesters = points
                .Where(p => p.PointStatus == PointStatus.Fail)
                .Select(p => $"{p.SemesterName}({p.ClassName})")
                .Distinct()
                .ToList();

            var passedSemesters = points
                .Where(p => p.PointStatus == PointStatus.Pass)
                .Select(p => $"{p.SemesterName}({p.ClassName})")
                .Distinct()
                .ToList();

            result.Add((pair.Student, pair.SubjectCode, string.Join(", ", failedSemesters), string.Join(", ", passedSemesters)));
        }

        return new Pagination<(Student, string, string, string)>
        {
            Items = result,
            PageIndex = pageNumber,
            PageSize = pageSize,
            TotalItems = totalCount
        };
    }
}

/// <summary>
/// DTO used to map raw SQL results for failed/passed semesters per student-subject pair.
/// This is not part of the EF model and is intended solely for materialization of query results.
/// </summary>
public class FailedSubjectDto
{
    public required string StudentCode { get; set; }
    public required string SubjectCode { get; set; }
    public required string SemesterName { get; set; }
    public required string ClassName { get; set; }
    public required PointStatus PointStatus { get; set; }
}


