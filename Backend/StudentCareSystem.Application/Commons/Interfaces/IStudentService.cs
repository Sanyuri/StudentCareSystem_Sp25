using StudentCareSystem.Application.Commons.Models.Students;
using StudentCareSystem.Domain.Helpers;

namespace StudentCareSystem.Application.Commons.Interfaces;

public interface IStudentService
{
    Task ScanStudentAsync();
    Task<Pagination<GetStudentDto>> GetAllWithPaginationAsync(StudentFilter filter);
    Task<GetStudentDto> GetByStudentCodeAsync(string studentCode);
}
