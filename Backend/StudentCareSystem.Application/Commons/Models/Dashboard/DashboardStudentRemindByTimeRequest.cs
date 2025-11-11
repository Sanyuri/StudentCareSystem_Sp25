using System.ComponentModel.DataAnnotations;

using StudentCareSystem.Domain.Enums;

namespace StudentCareSystem.Application.Commons.Models.Dashboard;

public class DashboardStudentRemindRequest
{
    public EmailType? EmailType { get; set; }
    [Required]
    public DateTime FromDate { get; set; }
    [Required]
    public DateTime ToDate { get; set; }
}
