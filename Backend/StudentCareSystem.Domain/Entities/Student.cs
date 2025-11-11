using System.ComponentModel.DataAnnotations.Schema;

using Microsoft.EntityFrameworkCore;

using StudentCareSystem.Domain.Enums;
using StudentCareSystem.Domain.Interfaces;

namespace StudentCareSystem.Domain.Entities;

[Index(nameof(StudentName))]
public class Student : BaseEntity<Guid>
{
    public string StudentName { get; set; } = string.Empty;
    public string StudentCode { get; set; } = string.Empty;
    public string Class { get; set; } = string.Empty;
    public string Major { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Gender { get; set; } = string.Empty;
    public string Progress { get; set; } = string.Empty;
    [Column(TypeName = "nvarchar(5)")]
    public StudentStatus StatusCode { get; set; }
    public int CurrentTermNo { get; set; }
    public string Specialization { get; set; } = string.Empty;
    public string MobilePhone { get; set; } = string.Empty;
    public string ParentPhone { get; set; } = string.Empty;
    public bool IsAttendanceExempt { get; set; }
    public virtual ICollection<StudentAttendance> StudentAttendances { get; set; } = [];
    public virtual ICollection<StudentApplication> StudentApplications { get; set; } = [];
    public virtual ICollection<StudentDefer> StudentDefers { get; set; } = [];
    public virtual ICollection<StudentNote> Notes { get; set; } = [];
    public virtual ICollection<EmailLog> EmailLogs { get; set; } = [];
    public virtual ICollection<StudentPoint> StudentPoints { get; set; } = [];
    public virtual StudentPsychology? StudentPsychology { get; set; }
    public virtual ICollection<StudentNeedCare> StudentNeedCares { get; set; } = [];
    public virtual ICollection<StudentSubject> StudentSubjects { get; set; } = [];
}
