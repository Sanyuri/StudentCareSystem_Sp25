namespace StudentCareSystem.Infrastructure.Models.StudentSubjects;

public class FapStudentSubject
{
    public string RollNumber { get; set; } = string.Empty;
    public string SubjectCode { get; set; } = string.Empty;
    public string SubjectName { get; set; } = string.Empty;
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public string ClassName { get; set; } = string.Empty;
    public bool IsCancelled { get; set; }
    public bool IsCheckFinance { get; set; }
}
