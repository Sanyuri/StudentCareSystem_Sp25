using StudentCareSystem.Application.Commons.Models.Roles;

namespace StudentCareSystem.Application.Commons.Models.Permissions;

public class GetPermissionDto
{
    public Guid Id { get; set; }
    public string PermissionType { get; set; } = string.Empty;
    public string VietnameseName { get; set; } = string.Empty;
    public string EnglishName { get; set; } = string.Empty;
    public GetRoleDto Role { get; set; } = new GetRoleDto();

}
