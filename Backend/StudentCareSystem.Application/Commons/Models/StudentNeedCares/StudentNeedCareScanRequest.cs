using System.ComponentModel.DataAnnotations;

namespace StudentCareSystem.Application.Commons.Models.StudentNeedCares;

public class StudentNeedCareScanRequest
{
    [Required]
    public int NumberOfStudentNeedCare { get; set; }
}
