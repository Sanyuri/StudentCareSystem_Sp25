using StudentCareSystem.Application.Commons.Models.Roles;

namespace StudentCareSystem.Application.Commons.Models.Users;

public class GetUserDto
{
    public Guid Id { get; set; }
    public string? UserName { get; set; }
    public string? FullName { get; set; }
    public string? Email { get; set; }
    public string? PhoneNumber { get; set; }
    public string? Address { get; set; }
    public string? DOB { get; set; }
    public GetRoleDto? Role { get; set; }
    public string? Note { get; set; }
    public List<Guid>? MajorIds { get; set; }
    public List<Guid>? PermissionIds { get; set; }
    public bool IsEnable2Fa { get; set; }
}
