using StudentCareSystem.Application.Commons.Models.Roles;

namespace StudentCareSystem.Application.Commons.Interfaces
{
    public interface IRoleService
    {
        Task<IEnumerable<GetRoleDto>> GetAllAsync();
        Task<GetRoleDto> GetByIdAsync(Guid id);
        Task<GetRoleDto> UpdateAsync(UpdateRoleDto role);

    }
}
