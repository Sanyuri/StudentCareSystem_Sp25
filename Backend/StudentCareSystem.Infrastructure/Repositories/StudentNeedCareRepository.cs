using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

using StudentCareSystem.Domain.Entities;
using StudentCareSystem.Domain.Interfaces;
using StudentCareSystem.Infrastructure.Data;

namespace StudentCareSystem.Infrastructure.Repositories;

public class StudentNeedCareRepository(ScsDbContext context, IHttpContextAccessor httpContext)
 : BaseRepository<StudentNeedCare>(context, httpContext), IStudentNeedCareRepository
{
    private readonly ScsDbContext _context = context;

    public async Task<IEnumerable<StudentNeedCare>> GetAllBySemesterAsync(string semesterName)
    {
        return await _context.StudentNeedCares.Where(x => x.SemesterName == semesterName).ToListAsync();
    }

    public Task<StudentNeedCare?> GetByStudentCodeAsync(string studentCode)
    {
        return _context.StudentNeedCares.FirstOrDefaultAsync(x => x.StudentCode == studentCode);
    }
}
