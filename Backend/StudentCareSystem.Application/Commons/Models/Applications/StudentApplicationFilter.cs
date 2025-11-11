using StudentCareSystem.Domain.Enums;

namespace StudentCareSystem.Application.Commons.Models.Applications;
public class StudentApplicationFilter : PagingFilterBase
{
    // Search term for student code or email
    public string? SearchTerm { get; set; }

    // Filter by application type ID
    public Guid? ApplicationTypeId { get; set; }

    // Date range (start date)
    public DateTime? DateFrom { get; set; }

    // Date range (end date)
    public DateTime? DateTo { get; set; }

    // Filter by application status
    public ApplicationStatus? Status { get; set; }
}
