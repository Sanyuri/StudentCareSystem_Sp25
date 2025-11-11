using StudentCareSystem.Application.Commons.Models.Permissions;

namespace StudentCareSystem.Application.Commons.Models.Users
{
    public class UserPermissionDto
    {
        public Guid UserId { get; set; }
        public Guid PermissionId { get; set; }
        public GetUserDto? User { get; set; }
        public GetPermissionDto? Permission { get; set; }

    }
}
