using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

using StudentCareSystem.Domain.Entities;
using StudentCareSystem.Domain.Interfaces;
using StudentCareSystem.Infrastructure.Data;

namespace StudentCareSystem.Infrastructure.Repositories;

public class StudentSubjectRepository(ScsDbContext context, IHttpContextAccessor httpContext)
 : BaseRepository<StudentSubject>(context, httpContext), IStudentSubjectRepository
{
    private readonly ScsDbContext _context = context;
    public async Task<IEnumerable<StudentSubject>> GetStudentSubjectsAsync(
    IEnumerable<string> studentCodes,
    DateTime? startDate = null,
    DateTime? endDate = null)
    {
        var query = _context.StudentSubjects.AsQueryable();

        if (studentCodes?.Any() == true)
            query = query.Where(x => studentCodes.Contains(x.StudentCode));

        if (startDate.HasValue)
            query = query.Where(x => x.StartDate >= startDate.Value);

        if (endDate.HasValue)
            query = query.Where(x => x.EndDate <= endDate.Value);

        return await query.ToListAsync();
    }

}
