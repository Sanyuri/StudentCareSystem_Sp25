namespace StudentCareSystem.Application.Commons.Models.StudentNeedCares;

public class ScannedStudentNeedCareDto : PagingFilterBase
{
    public string? Query { get; set; }
    public int CurrentTermNo { get; set; }
}
