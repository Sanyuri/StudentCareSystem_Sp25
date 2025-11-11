using StudentCareSystem.Domain.Enums;

namespace StudentCareSystem.Application.Commons.Models.StudentNeedCares;

public class ChangeCareStatusDto
{
    public Guid Id { get; set; }
    public CareStatus CareStatus { get; set; }
}
