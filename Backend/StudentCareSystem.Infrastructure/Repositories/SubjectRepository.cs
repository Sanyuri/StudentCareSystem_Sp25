using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

using StudentCareSystem.Domain.Entities;
using StudentCareSystem.Domain.Interfaces;
using StudentCareSystem.Infrastructure.Data;

namespace StudentCareSystem.Infrastructure.Repositories;

public class SubjectRepository(ScsDbContext context, IHttpContextAccessor httpContext)
 : BaseRepository<Subject>(context, httpContext), ISubjectRepository
{
    private readonly ScsDbContext _context = context;

    public async Task<List<Subject>> GetAllWithAttendanceAsync()
    {
        return await _context.Subjects
            .Where(x => x.TakeAttendance)
            .ToListAsync();
    }
}
