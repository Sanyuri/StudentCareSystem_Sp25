namespace StudentCareSystem.Application.Commons.Models.StudentNeedCareAssignments;

public class CreateStudentCareAssignmentDto
{
    public Guid StudentNeedCareId { get; set; }
    public Guid UserId { get; set; }
}
