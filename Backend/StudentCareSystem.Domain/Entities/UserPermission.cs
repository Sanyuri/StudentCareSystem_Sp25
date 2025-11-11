using StudentCareSystem.Domain.Interfaces;

namespace StudentCareSystem.Domain.Entities;


public class UserPermission : BaseEntity<Guid>
{
    public Guid UserId { get; set; }
    public Guid PermissionId { get; set; }
    public virtual User? User { get; set; }
    public virtual Permission? Permission { get; set; }
}
