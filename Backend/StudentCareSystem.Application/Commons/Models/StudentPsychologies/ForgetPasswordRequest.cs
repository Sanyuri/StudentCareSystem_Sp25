using System.ComponentModel.DataAnnotations;

namespace StudentCareSystem.Application.Commons.Models.StudentPsychologies;

public class ForgetPasswordRequest
{
    [Required(ErrorMessage = "Id is required")]
    public Guid Id { get; set; }
    [Required(ErrorMessage = "Password is required")]
    public string Password { get; set; } = string.Empty;
}
