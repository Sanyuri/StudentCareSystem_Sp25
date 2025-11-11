using System.ComponentModel.DataAnnotations.Schema;

using StudentCareSystem.Domain.Enums;
using StudentCareSystem.Domain.Interfaces;

namespace StudentCareSystem.Domain.Entities;

public class StudentNeedCare : BaseEntity<Guid>
{
    public string StudentCode { get; set; } = string.Empty;
    public string SemesterName { get; set; } = string.Empty;
    public double Point { get; set; }
    public int Rank { get; set; }
    public bool IsCollaborating { get; set; }
    public bool IsProgressing { get; set; }
    public bool NeedsCareNextTerm { get; set; }
    [Column(TypeName = "nvarchar(20)")]
    public CareStatus CareStatus { get; set; }
    public string Reason { get; set; } = string.Empty;
    public string FinalComment { get; set; } = string.Empty;
    public virtual Student? Student { get; set; }
    public int Cluster { get; set; }
    public virtual ICollection<StudentCareAssignment> StudentCareAssignments { get; set; } = [];
    public virtual ICollection<ProgressCriterion> ProgressCriteria { get; set; } = [];
}

