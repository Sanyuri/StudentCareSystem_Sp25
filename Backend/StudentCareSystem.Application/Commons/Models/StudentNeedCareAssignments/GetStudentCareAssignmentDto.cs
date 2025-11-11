using StudentCareSystem.Application.Commons.Models.Users;

namespace StudentCareSystem.Application.Commons.Models.StudentNeedCareAssignments;

public class GetStudentCareAssignmentDto
{
    public Guid Id { get; set; }
    public Guid StudentNeedCareId { get; set; }
    public GetUserDto? User { get; set; }

}
