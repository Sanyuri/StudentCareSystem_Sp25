using System.ComponentModel.DataAnnotations;

namespace StudentCareSystem.Application.Commons.Models.StudentPsychologies;

public class CreateStudentPsychologyDto
{
    [Required]
    public string StudentCode { get; set; } = string.Empty;
    [Required]
    public string AccessPassword { get; set; } = string.Empty;
}
