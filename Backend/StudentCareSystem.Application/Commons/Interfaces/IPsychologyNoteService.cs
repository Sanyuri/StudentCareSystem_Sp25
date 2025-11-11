using StudentCareSystem.Application.Commons.Models.PsychologyNotes;

namespace StudentCareSystem.Application.Commons.Interfaces;

public interface IPsychologyNoteService
{
    Task<GetPsychologyNoteDto> AddAsync(CreatePsychologyNoteDto psychologyNoteDto);
    Task<GetPsychologyNoteDto> GetByIdAsync(Guid id);
    Task<IEnumerable<GetPsychologyNoteDto>> GetByStudentPsychologyIdAsync(Guid studentPsychologyId);
    Task UpdateAsync(UpdatePsychologyNoteDto psychologyNoteDto);
    Task UpdateDriveUrlAsync(Guid id, string driveUrl);

}
