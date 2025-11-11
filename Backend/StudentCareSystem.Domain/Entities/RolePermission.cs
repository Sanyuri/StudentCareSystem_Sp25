using System.ComponentModel.DataAnnotations.Schema;

using StudentCareSystem.Domain.Interfaces;

namespace StudentCareSystem.Domain.Entities;

public class RolePermission : BaseEntity<Guid>
{
    public Guid RoleId { get; set; }
    public Guid PermissionId { get; set; }
    [ForeignKey("RoleId")]
    public virtual Role? Role { get; set; }
    [ForeignKey("PermissionId")]
    public virtual Permission? Permission { get; set; }
}
