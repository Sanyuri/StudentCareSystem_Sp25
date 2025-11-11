using StudentCareSystem.Application.Commons.Models.ProgressCriteria;

namespace StudentCareSystem.Application.Commons.Interfaces;

public interface IProgressCriterionService
{
    public Task<GetProgressCriterionDto> AddAsync(CreateProgressCriterionDto createProgressCriterionDto);
    public Task UpdateAsync(UpdateProgressCriterionDto updateProgressCriterionDto);
    public Task<IEnumerable<GetProgressCriterionDto>> GetByStudentNeedCareIdAsync(Guid studentNeedCareId);
    public Task UpdateAllByStudentNeedCareIdAsync(Guid studentNeedCareId, IEnumerable<UpdateProgressCriterionDto> updateProgressCriterionDtos);
}
