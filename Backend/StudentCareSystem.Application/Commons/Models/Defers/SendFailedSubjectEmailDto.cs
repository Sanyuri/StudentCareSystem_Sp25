using System.ComponentModel.DataAnnotations;

namespace StudentCareSystem.Application.Commons.Models.Defers;

public class SendFailedSubjectEmailDto
{
    [Required]
    public Guid EmailSampleId { get; set; }
    [Required]
    public string SemesterName { get; set; } = string.Empty;
}
