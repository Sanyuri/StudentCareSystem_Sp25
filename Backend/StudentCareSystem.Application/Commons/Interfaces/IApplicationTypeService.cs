using StudentCareSystem.Application.Commons.Models.ApplicationTypes;
using StudentCareSystem.Domain.Helpers;

namespace StudentCareSystem.Application.Commons.Interfaces;

public interface IApplicationTypeService
{
    Task<Pagination<ApplicationTypeResponse>> GetAllWithPaginationAsync(ApplicationTypeFilter filter);
    Task<List<ApplicationTypeResponse>> GetApplicationTypes();
    Task<ApplicationTypeResponse> GetByIdAsync(Guid id);
    Task<ApplicationTypeResponse> AddAsync(ApplicationTypeRequest applicationTypeRequest);
    Task UpdateAsync(Guid id, ApplicationTypeRequest applicationTypeRequest);
    Task DeleteAsync(Guid id);

}
