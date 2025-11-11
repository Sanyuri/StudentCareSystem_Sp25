using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

using StudentCareSystem.Domain.Entities;
using StudentCareSystem.Domain.Interfaces;
using StudentCareSystem.Infrastructure.Data;

namespace StudentCareSystem.Infrastructure.Repositories;

public class StudentPsychologyRepository(ScsDbContext context, IHttpContextAccessor httpContext)
 : BaseRepository<StudentPsychology>(context, httpContext), IStudentPsychologyRepository
{
    private readonly ScsDbContext _context = context;

    public Task<StudentPsychology?> GetByStudentCodeAsync(string studentCode)
    {
        return _context.StudentPsychologies.FirstOrDefaultAsync(x => x.StudentCode == studentCode);
    }

    public async Task DeleteAsync(StudentPsychology studentPsychology)
    {
        // Load related PsychologyNotes to ensure proper cascade delete
        await _context.Entry(studentPsychology)
            .Collection(s => s.PsychologyNotes)
            .LoadAsync();

        // For each PsychologyNote, load related PsychologyNoteDetails
        foreach (var note in studentPsychology.PsychologyNotes)
        {
            await _context.Entry(note)
                .Collection(n => n.PsychologyNoteDetails)
                .LoadAsync();
        }

        // Delete the StudentPsychology (cascade will handle related entities)
        _context.StudentPsychologies.Remove(studentPsychology);
        await _context.SaveChangesAsync();

    }
}
