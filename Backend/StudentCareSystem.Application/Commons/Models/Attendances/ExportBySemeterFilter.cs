using System.ComponentModel.DataAnnotations;

namespace StudentCareSystem.Application.Commons.Models.Attendances;

public class ExportBySemesterFilter : PagingFilterBase
{
    [Required]
    public string SemesterName { get; set; } = string.Empty;

    public bool? IsEnglish { get; set; }

}
