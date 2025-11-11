using StudentCareSystem.Application.Commons.Models.Permissions;

namespace StudentCareSystem.Application.Commons.Models.Roles;

public class GetRoleDto
{
    public Guid Id { get; set; }
    public string RoleType { get; set; } = string.Empty;
    public string VietnameseName { get; set; } = string.Empty;
    public string EnglishName { get; set; } = string.Empty;
    public List<GetPermissionDto> Permissions { get; set; } = [];
}
