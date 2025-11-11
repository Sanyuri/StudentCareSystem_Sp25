using StudentCareSystem.Domain.Enums;

namespace StudentCareSystem.Application.Commons.Models.StudentNeedCares;

public class FinalEvaluateStudentCareDto
{
    public Guid Id { get; set; }
    public bool IsCollaborating { get; set; }
    public bool IsProgressing { get; set; }
    public bool NeedsCareNextTerm { get; set; }
    public CareStatus CareStatus { get; set; }
    public string FinalComment { get; set; } = string.Empty;
}
