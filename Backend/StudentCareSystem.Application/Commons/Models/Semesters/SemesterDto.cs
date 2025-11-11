namespace StudentCareSystem.Application.Commons.Models.Semesters;

public class SemesterDto
{
    public Guid Id { get; set; }
    public string SemesterName { get; set; } = string.Empty;
    public bool IsCurrentSemester { get; set; }
    public DateTime EndDate { get; set; }
    public DateTime StartDate { get; set; }
}
