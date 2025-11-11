using StudentCareSystem.Domain.Entities;

namespace StudentCareSystem.Domain.Interfaces;

public interface IStudentNoteRepository : IBaseRepository<StudentNote>
{
    Task<StudentNote?> GetByIdAsync(Guid id);
}
