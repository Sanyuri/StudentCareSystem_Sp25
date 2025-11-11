using StudentCareSystem.Application.Commons.Models.Students;

namespace StudentCareSystem.Application.Commons.Models.Points;

public class GetStudentFailedDto
{
    public GetStudentDto Student { get; set; } = new();
    public string StudentCode { get; set; } = string.Empty;
    public string SubjectCode { get; set; } = string.Empty;
    public string FailedSemesters { get; set; } = string.Empty;
    public string PassedSemesters { get; set; } = string.Empty;
}
