using StudentCareSystem.Application.Commons.Models.Students;

namespace StudentCareSystem.Application.Commons.Models.StudentPsychologies;

public class GetStudentPsychologyDto
{
    public Guid Id { get; set; }
    public string StudentCode { get; set; } = string.Empty;
    public string UserId { get; set; } = string.Empty;
    public GetStudentDto? Student { get; set; }
}
