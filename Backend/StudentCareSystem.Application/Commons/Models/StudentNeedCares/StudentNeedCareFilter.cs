using StudentCareSystem.Domain.Enums;

namespace StudentCareSystem.Application.Commons.Models.StudentNeedCares;

public class StudentNeedCareFilter : PagingFilterBase
{
    public string? Query { get; set; }
    public int? Rank { get; set; }
    public bool? IsCollaborating { get; set; }
    public bool? IsProgressing { get; set; }
    public bool? NeedsCareNextTerm { get; set; }
    public Guid? UserId { get; set; }
    public string SemesterName { get; set; } = string.Empty;
    public CareStatus? CareStatus { get; set; }

}
