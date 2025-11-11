using System.ComponentModel.DataAnnotations;

namespace Application.Commons.Models.StudentPsychology;

public class UpdateStudentPsychologyPasswordRequest
{
    [Required(ErrorMessage = "Id is required")]
    public Guid Id { get; set; }
    [Required(ErrorMessage = "Old Password is required")]
    public string OldAccessPassword { get; set; } = string.Empty;
    [Required(ErrorMessage = "New Password is required")]
    public string NewAccessPassword { get; set; } = string.Empty;
}
