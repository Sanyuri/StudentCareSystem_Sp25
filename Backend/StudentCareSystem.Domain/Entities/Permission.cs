using System.ComponentModel.DataAnnotations.Schema;

using StudentCareSystem.Domain.Enums;
using StudentCareSystem.Domain.Interfaces;

namespace StudentCareSystem.Domain.Entities;

public class Permission : BaseEntity<Guid>
{
    [Column(TypeName = "nvarchar(50)")]
    public PermissionType PermissionType { get; set; }
    public string VietnameseName { get; set; } = string.Empty;
    public string EnglishName { get; set; } = string.Empty;
    public string PermissionDescription { get; set; } = string.Empty;
    public ICollection<UserPermission> UserPermissions { get; set; } = [];
    public ICollection<RolePermission> RolePermissions { get; set; } = [];
}
