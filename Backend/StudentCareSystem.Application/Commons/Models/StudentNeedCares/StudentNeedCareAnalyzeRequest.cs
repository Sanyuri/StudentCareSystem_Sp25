using System.ComponentModel.DataAnnotations;

namespace StudentCareSystem.Application.Commons.Models.StudentNeedCares;

public class StudentNeedCareAnalyzeRequest
{
    [Required]
    public string Semestername { get; set; } = string.Empty;
}
