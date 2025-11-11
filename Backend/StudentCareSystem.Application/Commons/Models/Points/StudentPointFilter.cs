using Microsoft.AspNetCore.Mvc;

using StudentCareSystem.Application.Commons.Utilities.ModelBinders;
using StudentCareSystem.Domain.Enums;

namespace StudentCareSystem.Application.Commons.Models.Points;


public class StudentPointFilter : PagingFilterBase
{
    public string? Query { get; set; }
    [ModelBinder(BinderType = typeof(CommaSeparatedModelBinder))]
    public IEnumerable<string>? Semesters { get; set; }
    public string? ClassName { get; set; }
    public string? SubjectCode { get; set; }
    public PointStatus? PointStatus { get; set; }
    public FailReason? FailReason { get; set; }
}
