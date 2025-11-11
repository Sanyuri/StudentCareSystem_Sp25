using StudentCareSystem.Application.Commons.Models.StudentNeedCareAssignments;
using StudentCareSystem.Application.Commons.Models.Students;
using StudentCareSystem.Domain.Enums;

namespace StudentCareSystem.Application.Commons.Models.StudentNeedCares;

public class GetStudentNeedCareDto
{
    public Guid Id { get; set; }
    public string StudentCode { get; set; } = string.Empty;
    public string SemesterName { get; set; } = string.Empty;
    public int Rank { get; set; }
    public bool IsCollaborating { get; set; }
    public bool IsProgressing { get; set; }
    public bool NeedsCareNextTerm { get; set; }
    public string CareStatus { get; set; } = string.Empty;
    public string FinalComment { get; set; } = string.Empty;
    public GetStudentDto? Student { get; set; }
    public ICollection<GetStudentCareAssignmentDto> StudentCareAssignments { get; set; } = [];
}
