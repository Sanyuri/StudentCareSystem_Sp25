using StudentCareSystem.Application.Commons.Models.NoteTypes;
using StudentCareSystem.Domain.Enums;

namespace StudentCareSystem.Application.Commons.Interfaces;

public interface INoteTypeService
{
    Task<IEnumerable<GetNoteTypeDto>> GetAllAsync();
    Task<GetNoteTypeDto> GetByIdAsync(Guid id);
    Task<GetNoteTypeDto> GetByDefaultTypeAsync(DefaultNoteType defaultNoteType);
    Task<GetNoteTypeDto> AddAsync(CreateNoteTypeDto noteType);
    Task UpdateAsync(UpdateNoteTypeDto noteType);
    Task DeleteAsync(Guid id);
}
