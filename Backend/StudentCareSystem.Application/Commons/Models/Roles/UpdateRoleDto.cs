using System.ComponentModel.DataAnnotations;

namespace StudentCareSystem.Application.Commons.Models.Roles;

public class UpdateRoleDto
{
    public Guid Id { get; set; }
    [Required]
    public string VietnameseName { get; set; } = string.Empty;
    [Required]
    public string EnglishName { get; set; } = string.Empty;
    public HashSet<Guid> PermissionIds { get; set; } = [];
}
