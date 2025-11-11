using StudentCareSystem.Domain.Entities;

namespace StudentCareSystem.Domain.Interfaces;

public interface IStudentPsychologyRepository : IBaseRepository<StudentPsychology>
{
    Task<StudentPsychology?> GetByStudentCodeAsync(string studentCode);
    Task DeleteAsync(StudentPsychology studentPsychology);
}
