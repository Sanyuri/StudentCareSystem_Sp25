using StudentCareSystem.Application.Commons.Models.PsychologyNoteTypes;

namespace StudentCareSystem.Application.Commons.Interfaces;

public interface IPsychologyNoteTypeService
{
    Task<IEnumerable<GetPsychologyNoteTypeDto>> GetAllAsync();
    Task<GetPsychologyNoteTypeDto> GetByIdAsync(Guid id);
    Task<GetPsychologyNoteTypeDto> AddAsync(CreatePsychologyNoteTypeDto createPsychologyNoteTypeDto);
    Task UpdateAsync(UpdatePsychologyNoteTypeDto updatePsychologyNoteTypeDto);
    Task DeleteAsync(Guid id);
}
