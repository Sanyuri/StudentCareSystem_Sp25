using StudentCareSystem.Application.Commons.Models.Permissions;

namespace StudentCareSystem.Application.Commons.Interfaces;

public interface IPermissionService
{
    public Task<IEnumerable<GetPermissionDto>> GetAllAsync();
    public Task<IEnumerable<GetPermissionDto>> GetByRoleAsync(Guid roleId);
    public Task AutoSetPermissionsForRoleAsync();
}
