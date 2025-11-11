using StudentCareSystem.Domain.Enums;

namespace StudentCareSystem.Application.Commons.Models.Users
{
    public class UserFilter : PagingFilterBase
    {
        public string? Query { get; set; }
        public UserStatus? Status { get; set; }
        public RoleType? Role { get; set; }
    }
}
