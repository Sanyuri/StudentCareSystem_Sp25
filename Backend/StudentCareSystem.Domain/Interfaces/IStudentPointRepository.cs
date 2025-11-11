using StudentCareSystem.Domain.Entities;
using StudentCareSystem.Domain.Helpers;

namespace StudentCareSystem.Domain.Interfaces;

public interface IStudentPointRepository : IBaseRepository<StudentPoint>
{
    /// <summary>
    /// Get all subjects that the student has failed.
    /// </summary>
    /// <param name="studentCode">The student code.</param>
    /// <returns>A list of subjects that the student has failed.</returns>
    Task<IEnumerable<StudentPoint>> GetDebtSubjectsAsync(string studentCode);

    /// <summary>
    /// Get failed subjects for a given semester.
    /// </summary>
    /// <param name="semesterName">Semester name string to filter records.</param>
    /// <returns>Failed student point records for the semester.</returns>
    Task<IEnumerable<StudentPoint>> GetStudentFailedSubjectsBySemesterAsync(string semesterName);

    /// <summary>
    /// Get paginated failed subject summary grouped by student and subject.
    /// The returned tuple contains:
    /// (Student, SubjectCode, FailedSemesters, PassedSemesters).
    /// </summary>
    /// <param name="fromSemester">Lower bound semester (StartDate) to include.</param>
    /// <param name="pageNumber">Page index (1-based).</param>
    /// <param name="pageSize">Page size.</param>
    /// <returns>Paged results of tuples with student and semester lists.</returns>
    Task<Pagination<(Student, string, string, string)>> GetFailedSubjectsByStudentAsync(Semester fromSemester, int pageNumber, int pageSize);
}
