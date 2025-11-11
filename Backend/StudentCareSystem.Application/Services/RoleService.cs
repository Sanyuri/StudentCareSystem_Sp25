using AutoMapper;

using Microsoft.EntityFrameworkCore;

using StudentCareSystem.Application.Commons.Exceptions;
using StudentCareSystem.Application.Commons.Interfaces;
using StudentCareSystem.Application.Commons.Models.Roles;
using StudentCareSystem.Domain.Entities;
using StudentCareSystem.Domain.Interfaces;
using StudentCareSystem.Infrastructure.Specifications;

namespace StudentCareSystem.Application.Services;

public class RoleService(
    IMapper mapper,
    IUnitOfWork unitOfWork
) : IRoleService
{

    public async Task<IEnumerable<GetRoleDto>> GetAllAsync()
    {
        var roles = await unitOfWork.RoleRepository.GetAllAsync();
        return mapper.Map<IEnumerable<GetRoleDto>>(roles);
    }

    public async Task<GetRoleDto> GetByIdAsync(Guid id)
    {
        var roleSpecification = new SpecificationBuilder<Role>()
            .Where(r => r.Id == id)
            .Include(r =>
                r.Include(x => x.RolePermissions)
                .ThenInclude(x => x.Permission))
            .Build();
        var result = await unitOfWork.RoleRepository.FirstOrDefaultAsync(roleSpecification);
        return mapper.Map<GetRoleDto>(result);
    }

    public async Task<GetRoleDto> UpdateAsync(UpdateRoleDto role)
    {
        var roleSpecification = new SpecificationBuilder<Role>()
            .Where(r => r.Id == role.Id)
            .Include(r => r.Include(x => x.RolePermissions))
            .Build();
        var roleEntity = await unitOfWork.RoleRepository.FirstOrDefaultAsync(roleSpecification)
            ?? throw new EntityNotFoundException($"Role with id {role.Id} not found");
        roleEntity.VietnameseName = role.VietnameseName;
        roleEntity.EnglishName = role.EnglishName;
        await IsPermissionsValid(role.PermissionIds);
        roleEntity.RolePermissions.Clear();
        roleEntity.RolePermissions = [
            .. role.PermissionIds.Distinct().Select(p => new RolePermission
            {
                RoleId = role.Id,
                PermissionId = p
            })
        ];
        unitOfWork.RoleRepository.Update(roleEntity);
        await unitOfWork.SaveChangesAsync();
        return mapper.Map<GetRoleDto>(roleEntity);
    }

    private async Task IsPermissionsValid(HashSet<Guid> guids)
    {
        var specification = new SpecificationBuilder<Permission>()
            .Where(p => guids.Contains(p.Id))
            .Build();
        var permissions = await unitOfWork.PermissionRepository.GetAllAsync(specification);
        var permissionIds = permissions.Select(p => p.Id);
        var invalidPermissionIds = guids.Except(permissionIds);
        if (invalidPermissionIds.Any())
        {
            throw new EntityNotFoundException($"Permission with id {invalidPermissionIds.First()} not found");
        }
    }
}
