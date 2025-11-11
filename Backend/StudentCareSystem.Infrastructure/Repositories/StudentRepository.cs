using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

using StudentCareSystem.Domain.Entities;
using StudentCareSystem.Domain.Enums;
using StudentCareSystem.Domain.Interfaces;
using StudentCareSystem.Infrastructure.Data;

namespace StudentCareSystem.Infrastructure.Repositories;

public class StudentRepository(ScsDbContext context, IHttpContextAccessor httpContext) : BaseRepository<Student>(context, httpContext), IStudentRepository
{
    private readonly ScsDbContext _context = context;

    /// <summary>
    /// Gets a student by their student code asynchronously.
    /// </summary>
    /// <param name="studentCode">The student code.</param>
    /// <returns>A task that represents the asynchronous operation. The task result contains the student entity if found; otherwise, null.</returns>
    public async Task<Student?> GetByStudentCodeAsync(string studentCode)
    {
        return await _context.Students.FirstOrDefaultAsync(x => x.StudentCode == studentCode);
    }

    /// <summary>
    /// Gets a list of student codes by their status codes asynchronously.
    /// </summary>
    /// <param name="statusCodes">The list of student codes.</param>
    /// <returns>A task that represents the asynchronous operation. The task result contains a list of student codes that match the status codes.</returns>
    public async Task<List<string>> GetAllStudentCodeByStatusCodesAsync(IEnumerable<StudentStatus> statusCodes)
    {
        return await _context.Students
            .Where(x => statusCodes.Contains(x.StatusCode))
            .OrderBy(x => x.StudentCode.Substring(2))
            .Select(x => x.StudentCode).ToListAsync();
    }

    /// <summary>
    /// Gets a list of all student codes asynchronously.
    /// </summary>
    /// <returns>A task that represents the asynchronous operation. The task result contains a list of all student codes.</returns>
    public async Task<List<string>> GetAllStudentCodeAsync()
    {
        return await _context.Students
            .Select(x => x.StudentCode).ToListAsync();
    }

    public async Task<IEnumerable<Student>> GetAllStudentsInStudentCodesAsync(IEnumerable<string> studentCodes, IEnumerable<StudentStatus>? statusCodes = null)
    {
        var query = _context.Students.AsQueryable();

        if (statusCodes != null && statusCodes.Any())
        {
            query = query.Where(x => statusCodes.Contains(x.StatusCode));
        }

        return await query
            .Where(x => studentCodes.Contains(x.StudentCode))
            .ToListAsync();
    }
}
