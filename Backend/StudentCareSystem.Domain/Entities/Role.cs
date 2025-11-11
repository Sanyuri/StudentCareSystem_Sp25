using System.ComponentModel.DataAnnotations.Schema;

using StudentCareSystem.Domain.Enums;
using StudentCareSystem.Domain.Interfaces;

namespace StudentCareSystem.Domain.Entities;

/// <summary>
/// Represents a role in the Student Care System.
/// </summary>
public class Role : BaseEntity<Guid>
{
    [Column(TypeName = "nvarchar(10)")]
    public RoleType RoleType { get; set; }
    public string VietnameseName { get; set; } = string.Empty;
    public string EnglishName { get; set; } = string.Empty;
    public virtual ICollection<User> Users { get; set; } = [];
    public virtual ICollection<RolePermission> RolePermissions { get; set; } = [];
}

