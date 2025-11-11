using StudentCareSystem.Application.Commons.Models.Activities;
using StudentCareSystem.Domain.Helpers;

namespace StudentCareSystem.Application.Commons.Interfaces;

public interface IActivityService
{
    Task<IEnumerable<ActivitiesDto>> GetAllAsync();
    Task<Pagination<ActivitiesDto>> GetAllWithPaginationAsync(ActivityFilter filter);
}
