namespace StudentCareSystem.Infrastructure.Models.Subjects;

public class FapSubjectData
{
    public string SubjectCode { get; set; } = string.Empty;
    public string OldSubjectCode { get; set; } = string.Empty;
    public string SubjectGroup { get; set; } = string.Empty;
    public string SubjectName { get; set; } = string.Empty;
    public string SubjectV { get; set; } = string.Empty;
    public bool TakeAttendance { get; set; }
    public string ReplacedBy { get; set; } = string.Empty;
    public bool IsGraded { get; set; }
    public bool IsBeforeOjt { get; set; }
    public bool IsRequired { get; set; }

}
