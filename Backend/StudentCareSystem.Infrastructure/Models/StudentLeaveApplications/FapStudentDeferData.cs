namespace StudentCareSystem.Infrastructure.Models.StudentLeaveApplications;

public class FapStudentDeferData
{
    public string Note { get; set; } = string.Empty;
    public int AppStatus { get; set; }
    public string TypeName { get; set; } = string.Empty;
    public string RollNumber { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public DateTime CreatedDate { get; set; }
}
