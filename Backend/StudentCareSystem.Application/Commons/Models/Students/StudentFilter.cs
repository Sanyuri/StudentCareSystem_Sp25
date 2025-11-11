using StudentCareSystem.Domain.Enums;

namespace StudentCareSystem.Application.Commons.Models.Students;

public class StudentFilter : PagingFilterBase
{
    public string? Query { get; set; }
    public string? Class { get; set; }
    public string? Major { get; set; }
    public StudentStatus? StatusCode { get; set; }
    public int? CurrentTermNo { get; set; }
}
