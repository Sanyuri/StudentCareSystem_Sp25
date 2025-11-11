namespace StudentCareSystem.Infrastructure.Models.Students;

public class FapStudentDetail
{
    public string RollNumber { get; set; } = string.Empty;
    public DateTime DateOfBirth { get; set; }
    public string Email { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string MiddleName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
}
