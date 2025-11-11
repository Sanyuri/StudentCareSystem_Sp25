using Microsoft.AspNetCore.Mvc;

using StudentCareSystem.Application.Commons.Utilities.ModelBinders;
using StudentCareSystem.Domain.Enums;

namespace StudentCareSystem.Application.Commons.Models.Defers;

public class StudentDeferFilter : PagingFilterBase
{
    public string? Query { get; set; }

    public string? Type { get; set; }

    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public StudentDeferStatus? Status { get; set; }
    [ModelBinder(BinderType = typeof(CommaSeparatedModelBinder))]
    public IEnumerable<string>? Semesters { get; set; }
}
