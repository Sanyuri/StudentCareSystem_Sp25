using System.ComponentModel.DataAnnotations;

namespace StudentCareSystem.Application.Commons.Models.StudentPsychologies;

public class DeleteStudentPsychologyDto
{
    [Required]
    public Guid Id { get; set; }
}
