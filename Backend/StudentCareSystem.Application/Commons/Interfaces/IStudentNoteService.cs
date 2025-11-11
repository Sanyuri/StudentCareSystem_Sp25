using StudentCareSystem.Application.Commons.Models.Notes;
using StudentCareSystem.Domain.Helpers;

namespace StudentCareSystem.Application.Commons.Interfaces;

public interface IStudentNoteService
{
    Task<Pagination<GetStudentNoteDto>> GetAllWithPaginationAsync(StudentNoteFilter filter);
    Task<IEnumerable<GetStudentNoteDto>> GetByEntityIdAsync(Guid entityId);
    Task<IEnumerable<GetStudentNoteDto>> GetByStudentCodeAsync(string studentCode);
    Task<GetStudentNoteDto> AddAsync(CreateStudentNoteDto createStudentNoteDto);
    Task<IEnumerable<GetStudentNoteDto>> ImportAsync(IEnumerable<ImportStudentNoteDto> createStudentNoteDtos);
    Task UpdateAsync(UpdateStudentNoteDto updateStudentNodeDto);
    Task DeleteAsync(Guid id);
    Task<GetStudentNoteDto> GetByIdAsync(Guid id);

}
