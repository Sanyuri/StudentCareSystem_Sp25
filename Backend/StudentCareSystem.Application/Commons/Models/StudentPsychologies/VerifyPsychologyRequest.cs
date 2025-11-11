using System.ComponentModel.DataAnnotations;

namespace Application.Commons.Models.StudentPsychology
{
    public class VerifyPsychologyRequest
    {
        [Required(ErrorMessage = "StudentPsychology Id is required")]
        public Guid Id { get; set; }
        [Required(ErrorMessage = "Password is required")]
        public string AccessPassword { get; set; } = string.Empty;
    }
}
