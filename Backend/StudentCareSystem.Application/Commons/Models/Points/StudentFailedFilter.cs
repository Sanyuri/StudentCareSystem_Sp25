namespace StudentCareSystem.Application.Commons.Models.Points;

public class StudentFailedFilter : PagingFilterBase
{
    public string FromSemester { get; set; } = string.Empty;
}
