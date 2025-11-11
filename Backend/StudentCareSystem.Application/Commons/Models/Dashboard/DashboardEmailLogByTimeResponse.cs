using StudentCareSystem.Domain.Enums;

namespace StudentCareSystem.Application.Commons.Models.Dashboard;

public class DashboardEmailLogByTimeResponse
{
    public int TotalEmail { get; set; }
    public DateTime CreatedAt { get; set; }
    public EmailState EmailState { get; set; }
}
