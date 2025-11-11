using System.ComponentModel.DataAnnotations;

using StudentCareSystem.Domain.Enums;
using StudentCareSystem.Infrastructure.Attributes;

namespace StudentCareSystem.Application.Commons.Models.Users;

public class CreateUserDto
{
    [Required]
    public string Email { get; set; } = string.Empty;
    [FptEmailValidation]
    public string? FeEmail { get; set; }
    [Required]
    [Length(6, 100)]
    public string FullName { get; set; } = string.Empty;
    [Required]
    public Guid RoleId { get; set; }
    public HashSet<Guid> MajorIds { get; set; } = [];
    public HashSet<Guid> PermissionIds { get; set; } = [];
    public UserStatus Status { get; set; }
}
