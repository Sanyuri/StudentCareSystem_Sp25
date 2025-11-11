using System.ComponentModel.DataAnnotations;

using StudentCareSystem.Domain.Enums;
using StudentCareSystem.Infrastructure.Attributes;

namespace StudentCareSystem.Application.Commons.Models.Users;

public class UpdateUserDto
{
    [Required]
    public Guid Id { get; set; }
    [Required]
    public string Email { get; set; } = string.Empty;
    public string FeEmail { get; set; } = string.Empty;
    [Required]
    [Length(6, 100)]
    public string FullName { get; set; } = string.Empty;
    [Required]
    public Guid RoleId { get; set; }
    public HashSet<Guid> PermissionIds { get; set; } = [];
    [Required]
    public UserStatus Status { get; set; }
}
