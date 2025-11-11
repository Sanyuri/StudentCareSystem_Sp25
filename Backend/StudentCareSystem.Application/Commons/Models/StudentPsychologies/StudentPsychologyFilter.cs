namespace StudentCareSystem.Application.Commons.Models.StudentPsychologies;

public class StudentPsychologyFilter : PagingFilterBase
{
    public string? Query { get; set; } = string.Empty;
    public Guid? UserId { get; set; }
}
