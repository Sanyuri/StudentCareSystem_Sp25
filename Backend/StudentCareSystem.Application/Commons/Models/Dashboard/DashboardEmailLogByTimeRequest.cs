using System.ComponentModel.DataAnnotations;

namespace StudentCareSystem.Application.Commons.Models.Dashboard;

public class DashboardEmailLogByTimeRequest
{
    [Required]
    public DateTime FromDate { get; set; }

    [Required]
    public DateTime ToDate { get; set; }
}
