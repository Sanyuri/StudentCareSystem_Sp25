namespace StudentCareSystem.Application.Commons.Models.StudentNeedCareAssignments;

public class UpdateStudentCareAssignmentDto
{
    public Guid Id { get; set; }
    public Guid StudentNeedCareId { get; set; }
    public Guid UserId { get; set; }
}
