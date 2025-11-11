using StudentCareSystem.Domain.Enums;

namespace StudentCareSystem.Application.Commons.Models.Emails;

public class StudentNeedCareCount
{
    public int Total { get; set; }
    public int Todo { get; set; }
    public int Doing { get; set; }
    public int Done { get; set; }
    public string SemesterName { get; set; } = string.Empty;

    public StudentNeedCareCount(Dictionary<CareStatus, int> needCareStates, string semesterName)
    {
        Total = needCareStates.Values.Sum();
        Todo = needCareStates?.GetValueOrDefault(CareStatus.Todo) ?? 0;
        Doing = needCareStates?.GetValueOrDefault(CareStatus.Doing) ?? 0;
        Done = needCareStates?.GetValueOrDefault(CareStatus.Done) ?? 0;
        SemesterName = semesterName;
    }
}
