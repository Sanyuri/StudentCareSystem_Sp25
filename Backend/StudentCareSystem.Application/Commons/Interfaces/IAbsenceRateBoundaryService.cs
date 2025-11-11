using StudentCareSystem.Application.Commons.Models.AbsenceRateBoundaries;

namespace StudentCareSystem.Application.Commons.Interfaces;

public interface IAbsenceRateBoundaryService
{
    Task<IEnumerable<GetAbsenceRateBoundaryDto>> GetAllAsync();
    Task<GetAbsenceRateBoundaryDto> AddAsync(CreateAbsenceRateBoundaryDto absenceRateBoundaryDto);
    Task<GetAbsenceRateBoundaryDto> GetByIdAsync(Guid id);
    Task UpdateAsync(UpdateAbsenceRateBoundaryDto absenceRateBoundaryDto);
    Task DeleteAsync(Guid id);
}
