using StudentCareSystem.Application.Commons.Models.ApplicationTypes;

namespace StudentCareSystem.Application.Commons.Models.Dashboard;

public class DashboardTotalApplicationDto
{
    public int TotalReceivedApplication { get; set; }
    public int TotalReturnedApplication { get; set; }
    public IEnumerable<ApplicationTypeResponse> ApplicationTypes { get; set; } = [];
}
