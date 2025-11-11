using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

using StudentCareSystem.Domain.Entities;
using StudentCareSystem.Domain.Interfaces;
using StudentCareSystem.Infrastructure.Data;

namespace StudentCareSystem.Infrastructure.Repositories;

public class SemesterRepository(ScsDbContext context, IHttpContextAccessor httpContext)
    : BaseRepository<Semester>(context, httpContext), ISemesterRepository
{
    private readonly ScsDbContext _context = context;
    public async Task<Semester?> GetNextSemesterAsync(Semester currentSemester)
    {
        return await _context.Semesters
            .Where(s => s.StartDate > currentSemester.StartDate)
            .OrderBy(s => s.StartDate)
            .FirstOrDefaultAsync();
    }

    public async Task<Semester?> GetPreviousSemesterAsync(Semester currentSemester)
    {
        return await _context.Semesters
            .Where(s => s.StartDate < currentSemester.StartDate)
            .OrderByDescending(s => s.StartDate)
            .FirstOrDefaultAsync();
    }

    public async Task<Semester?> GetCurrentSemesterAsync()
    {
        return await _context.Semesters
            .Where(s => s.IsCurrentSemester)
            .FirstOrDefaultAsync();
    }

    public async Task<IEnumerable<string>> GetAllSemesterNamesAsync()
    {
        return await _context.Semesters
            .Select(s => s.SemesterName)
            .ToListAsync();
    }

    public async Task<Semester?> GetSemesterByNameAsync(string semesterName)
    {
        return await _context.Semesters
            .Where(s => s.SemesterName == semesterName)
            .FirstOrDefaultAsync();
    }
}
