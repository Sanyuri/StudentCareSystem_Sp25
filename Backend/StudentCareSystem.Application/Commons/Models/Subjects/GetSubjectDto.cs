namespace StudentCareSystem.Application.Commons.Models.Subjects;

public class GetSubjectDto
{
    public Guid Id { get; set; }
    public string SubjectCode { get; set; } = string.Empty;
    public string? OldSubjectCode { get; set; }
    public string SubjectGroup { get; set; } = string.Empty;
    public string VietnameseName { get; set; } = string.Empty;
    public string EnglishName { get; set; } = string.Empty;
    public bool TakeAttendance { get; set; }
    public string ReplacedBy { get; set; } = string.Empty;
    public bool IsGraded { get; set; }
    public bool IsBeforeOjt { get; set; }
    public bool IsRequired { get; set; }
}
