namespace StudentCareSystem.Application.Commons.Models.Subjects;

public class StudentSubjectFilter : PagingFilterBase
{
    public string? Query { get; set; }
    public string? SubjectGroup { get; set; }
    public bool? TakeAttendance { get; set; }
}
