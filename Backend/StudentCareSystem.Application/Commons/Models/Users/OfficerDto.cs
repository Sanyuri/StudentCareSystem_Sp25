using StudentCareSystem.Application.Commons.Models.Roles;

namespace StudentCareSystem.Application.Commons.Models.Users
{
    public class OfficerDto
    {
        public Guid Id { get; set; }
        public string? FullName { get; set; }
        public string? Email { get; set; }
        public string FeEmail { get; set; } = string.Empty;
        public GetRoleDto? Role { get; set; }
        public int? TotalPermissions { get; set; }
        public string? Status { get; set; }

    }
}
