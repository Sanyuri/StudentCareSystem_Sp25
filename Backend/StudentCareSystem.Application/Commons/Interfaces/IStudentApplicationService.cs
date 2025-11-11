using StudentCareSystem.Application.Commons.Models.Applications;
using StudentCareSystem.Domain.Helpers;


namespace StudentCareSystem.Application.Commons.Interfaces;

public interface IStudentApplicationService
{
    Task<Pagination<GetStudentApplicationDto>> GetAllWithPaginationAsync(StudentApplicationFilter filter);
    Task<GetStudentApplicationDto?> GetByIdAsync(Guid id);
    //Task UpdateAsync(UpdateStudentApplicationDto applicationDto);
    Task<GetStudentApplicationDto> AddAsync(CreateStudentApplicationDto applicationDto);
    Task DeleteAsync(Guid id);
}
