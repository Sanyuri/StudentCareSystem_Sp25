namespace StudentCareSystem.Application.Commons.Utilities;

public static class SubjectHelper
{

    public static bool IsCourseraSubject(string subject)
    {
        return subject.EndsWith('c');
    }

}
