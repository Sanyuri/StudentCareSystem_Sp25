using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

using StudentCareSystem.Domain.Entities;
using StudentCareSystem.Domain.Interfaces;
using StudentCareSystem.Infrastructure.Data;

namespace StudentCareSystem.Infrastructure.Repositories;

public class StudentNoteRepository(ScsDbContext context, IHttpContextAccessor httpContext)
 : BaseRepository<StudentNote>(context, httpContext), IStudentNoteRepository
{
    private readonly ScsDbContext _context = context;
    public async Task<StudentNote?> GetByIdAsync(Guid id)
    {
        return await _context.StudentNotes
          .Include(x => x.Student)
          .Include(x => x.NoteType)
          .FirstOrDefaultAsync(x => x.Id == id);
    }
}
