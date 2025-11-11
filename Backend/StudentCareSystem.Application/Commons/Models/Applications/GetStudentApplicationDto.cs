using StudentCareSystem.Application.Commons.Models.ApplicationTypes;

namespace StudentCareSystem.Application.Commons.Models.Applications;
public class GetStudentApplicationDto
{
    public Guid Id { get; set; }
    public string StudentCode { get; set; } = string.Empty;
    public string StudentName { get; set; } = string.Empty;
    public string StudentEmail { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public ApplicationTypeResponse ApplicationType { get; set; } = new ApplicationTypeResponse();
}
