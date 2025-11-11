using StudentCareSystem.Application.Commons.Models.Users;

namespace StudentCareSystem.Application.Commons.Models.Activities;

public class ActivitiesDto
{
    public Guid Id { get; set; }
    public DateTime CreatedAt { get; set; }
    public required string ActivityTypeName { get; set; }
    public required string Description { get; set; }
    public GetUserDto User { get; set; } = new();
}
