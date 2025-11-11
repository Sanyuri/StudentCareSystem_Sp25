using StudentCareSystem.Application.Commons.Models.Permissions;
using StudentCareSystem.Application.Commons.Models.Roles;

namespace StudentCareSystem.Application.Commons.Models.Users;

public class GetUserDetailDto
{
    public Guid Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public string FeEmail { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public GetRoleDto? Role { get; set; }
    public List<GetPermissionDto> Permissions { get; set; } = [];
    public string? Status { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
