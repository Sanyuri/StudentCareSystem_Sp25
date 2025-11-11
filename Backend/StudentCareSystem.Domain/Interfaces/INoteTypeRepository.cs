using StudentCareSystem.Domain.Entities;

namespace StudentCareSystem.Domain.Interfaces;

public interface INoteTypeRepository : IBaseRepository<NoteType>
{
    public Task<IEnumerable<Guid>> GetAllIdAsync();
}
