using System.ComponentModel.DataAnnotations;

namespace StudentCareSystem.Application.Commons.Models.Defers;

public class SendDeferEmailDto
{
    [Required]
    public Guid EmailSampleId { get; set; }
    [Required]
    public DateTime FromDate { get; set; }
    [Required]
    public DateTime ToDate { get; set; }
}
