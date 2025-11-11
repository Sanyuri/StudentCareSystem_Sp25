using System.ComponentModel.DataAnnotations;

namespace StudentCareSystem.Application.Commons.Models.Attendances;

public class ExportByDateFilter : PagingFilterBase
{
    [Required]
    public DateTime Date { get; set; }
    [Required]
    public Datetype DateType { get; set; }
}

public enum Datetype
{
    Date,
    Month,
    Year
}
