using StudentCareSystem.Domain.Enums;

namespace StudentCareSystem.Application.Commons.Models.Dashboard;

public class DashboardApplicationByTimeResponse
{
    public int TotalReceived { get; set; }
    public int TotalReturned { get; set; }
    public DateTime CreatedAt { get; set; }
    public ApplicationStatus Status { get; set; }
}
