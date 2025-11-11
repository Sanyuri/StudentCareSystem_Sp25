using StudentCareSystem.Domain.Interfaces;

namespace StudentCareSystem.Domain.Entities;

public class StudentSubject : BaseEntity<Guid>
{
    public string StudentCode { get; set; } = string.Empty;
    public string SubjectCode { get; set; } = string.Empty;
    public string ClassName { get; set; } = string.Empty;
    public bool IsCancelled { get; set; }
    public bool IsCheckFinance { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public virtual Student? Student { get; set; }
}
