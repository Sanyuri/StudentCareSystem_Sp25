namespace StudentCareSystem.Application.Commons.Models.Dashboard;

public class DashboardStudentCaredDto
{
    public int TotalStudentNeedCare { get; set; }
    public double PreviousPeriodDifferenceRate { get; set; }
    public int TotalStudentNotAssigned { get; set; }
    public int TotalStudentDoing { get; set; }
    public int TotalStudentTodo { get; set; }
    public int TotalStudentCared { get; set; }
}
