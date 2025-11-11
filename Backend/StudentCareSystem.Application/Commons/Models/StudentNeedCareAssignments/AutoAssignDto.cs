using System.ComponentModel.DataAnnotations;

namespace StudentCareSystem.Application.Commons.Models.StudentNeedCareAssignments;

public class AutoAssignDto
{
    public HashSet<UserAssignmentPercentageDto> UserPercentages { get; set; } = [];
}
