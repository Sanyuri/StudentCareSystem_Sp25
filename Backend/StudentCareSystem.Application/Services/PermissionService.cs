using AutoMapper;

using StudentCareSystem.Application.Commons.Interfaces;
using StudentCareSystem.Application.Commons.Models.Permissions;
using StudentCareSystem.Domain.Entities;
using StudentCareSystem.Domain.Interfaces;

namespace StudentCareSystem.Application.Services;

public class PermissionService(
    IMapper mapper,
    IUnitOfWork unitOfWork
) : IPermissionService
{
    public async Task<IEnumerable<GetPermissionDto>> GetAllAsync()
    {
        var permissions = await unitOfWork.PermissionRepository.GetAllAsync();
        return mapper.Map<IEnumerable<GetPermissionDto>>(permissions);
    }

    public async Task<IEnumerable<GetPermissionDto>> GetByRoleAsync(Guid roleId)
    {
        var permissions = await unitOfWork.PermissionRepository.GetByRoleAsync(roleId);
        return mapper.Map<IEnumerable<GetPermissionDto>>(permissions);
    }

    public async Task AutoSetPermissionsForRoleAsync()
    {
        //Get all user
        var users = await unitOfWork.UserRepository.GetAllAsync();
        // Get All UserPermissions and then clear them
        var userPermissions = await unitOfWork.UserPermissionRepository.GetAllAsync();
        await unitOfWork.UserPermissionRepository.DeleteBulkAsync(userPermissions);
        //Get all role permissions
        var rolePermissions = await unitOfWork.RolePermissionRepository.GetAllAsync();
        // Generate new role permissions for each user
        var rolePermissionDict = rolePermissions
            .GroupBy(rp => rp.RoleId)
            .ToDictionary(
                g => g.Key,
                g => g.Select(rp => rp.PermissionId).Distinct().ToList()
            );

        var userPermissionList = new List<UserPermission>();
        foreach (var user in users)
        {
            if (rolePermissionDict.TryGetValue(user.RoleId, out var permissionIds))
            {
                foreach (var permissionId in permissionIds)
                {
                    userPermissionList.Add(new UserPermission
                    {
                        UserId = user.Id,
                        PermissionId = permissionId
                    });
                }
            }
        }
        // Add new user permissions to the database
        await unitOfWork.UserPermissionRepository.AddBulkAsync(userPermissionList);
        await unitOfWork.SaveChangesAsync();
    }
}
