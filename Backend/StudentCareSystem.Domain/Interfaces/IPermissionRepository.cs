using StudentCareSystem.Domain.Entities;

namespace StudentCareSystem.Domain.Interfaces;

public interface IPermissionRepository : IBaseRepository<Permission>
{
    Task<IEnumerable<Permission>> GetByIdsAsync(List<Guid> ids);
    Task<IEnumerable<Permission>> GetByRoleAsync(Guid roleId);
}
