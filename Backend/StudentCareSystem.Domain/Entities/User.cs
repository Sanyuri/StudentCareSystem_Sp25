using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

using Microsoft.EntityFrameworkCore;

using StudentCareSystem.Domain.Enums;
using StudentCareSystem.Domain.Interfaces;

namespace StudentCareSystem.Domain.Entities;

[Index(nameof(Email), IsUnique = false)]
public class User : BaseEntity<Guid>
{
    public string UserName { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    [Required, DataType(DataType.EmailAddress)]
    public string Email { get; set; } = string.Empty;
    public string? FeEmail { get; set; }
    public string Password { get; set; } = string.Empty;
    public string TOtpSecret { get; set; } = string.Empty;
    public bool IsEnable2Fa { get; set; } = false;
    public string? PhoneNumber { get; set; }
    public string? DOB { get; set; }
    public Guid RoleId { get; set; }
    [Column(TypeName = "nvarchar(50)")]
    public UserStatus Status { get; set; }
    public string? Notes { get; set; }
    [ForeignKey("RoleId")]
    public virtual Role? Role { get; set; }
    public virtual ICollection<UserPermission> UserPermissions { get; set; } = [];
    public virtual ICollection<Activity> Activities { get; set; } = [];
    public virtual ICollection<RefreshToken> RefreshTokens { get; set; } = [];
    public virtual ICollection<StudentCareAssignment> StudentCareAssignments { get; set; } = [];
}

