using StudentCareSystem.Application.Commons.Models.ProgressCriterionTypes;

namespace StudentCareSystem.Application.Commons.Interfaces;

public interface IProgressCriterionTypeService
{
    Task<IEnumerable<GetProgressCriterionTypeDto>> GetAllAsync();
    Task<GetProgressCriterionTypeDto> GetByIdAsync(Guid id);
    Task<GetProgressCriterionTypeDto> AddAsync(CreateProgressCriterionTypeDto createProgressCriterionTypeDto);
    Task UpdateAsync(UpdateProgressCriterionTypeDto updateProgressCriterionTypeDto);
    Task DeleteAsync(Guid id);
}
