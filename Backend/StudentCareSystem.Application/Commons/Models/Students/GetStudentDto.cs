using StudentCareSystem.Domain.Enums;

namespace StudentCareSystem.Application.Commons.Models.Students;

public class GetStudentDto
{
    public Guid Id { get; set; }
    public string StudentName { get; set; } = string.Empty;
    public string StudentCode { get; set; } = string.Empty;
    public string Class { get; set; } = string.Empty;
    public string Major { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public bool IsCurrentSemester { get; set; }
    public string Gender { get; set; } = string.Empty;
    public string Progress { get; set; } = string.Empty;
    public StudentStatus StatusCode { get; set; }
    public int CurrentTermNo { get; set; }
    public string Specialization { get; set; } = string.Empty;
    public string MobilePhone { get; set; } = string.Empty;
    public string ParentPhone { get; set; } = string.Empty;
}
