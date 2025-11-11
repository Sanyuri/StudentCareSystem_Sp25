using StudentCareSystem.Application.Commons.Models.Users;
using StudentCareSystem.Domain.Enums;

namespace StudentCareSystem.Application.Commons.Models.StudentNeedCareAssignments;

public class GetCountStudentCareDto
{
    public GetUserDto User { get; set; } = new GetUserDto();
    public Dictionary<CareStatus, int> CareStatusCount { get; set; } = [];
}
