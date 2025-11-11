using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

using StudentCareSystem.Domain.Entities;
using StudentCareSystem.Domain.Interfaces;
using StudentCareSystem.Infrastructure.Data;

namespace StudentCareSystem.Infrastructure.Repositories;

public class NoteTypeRepository(ScsDbContext context, IHttpContextAccessor httpContext) : BaseRepository<NoteType>(context, httpContext), INoteTypeRepository
{
    private readonly ScsDbContext _context = context;
    public async Task<IEnumerable<Guid>> GetAllIdAsync()
    {
        return await _context.NoteTypes
            .Select(nt => nt.Id)
            .ToListAsync();
    }
}
