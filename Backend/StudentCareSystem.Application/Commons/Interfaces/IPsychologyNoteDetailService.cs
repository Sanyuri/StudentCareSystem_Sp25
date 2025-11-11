using StudentCareSystem.Application.Commons.Models.PsychologyNoteDetails;

namespace StudentCareSystem.Application.Commons.Interfaces;

public interface IPsychologyNoteDetailService
{
    Task<GetPsychologyNoteDetailDto> GetByIdAsync(Guid id);
    Task<GetPsychologyNoteDetailDto> AddAsync(CreatePsychologyNoteDetailDto createPsychologyNoteDetailDto);
    Task<GetPsychologyNoteDetailDto> UpdateAsync(UpdatePsychologyNoteDetailDto updatePsychologyNoteDetailDto);
    Task DeleteAsync(Guid id);
}
