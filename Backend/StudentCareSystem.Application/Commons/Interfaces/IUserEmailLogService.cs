using StudentCareSystem.Application.Commons.Models.UserEmailLogs;
using StudentCareSystem.Domain.Helpers;

namespace StudentCareSystem.Application.Commons.Interfaces;

public interface IUserEmailLogService
{
    Task<Pagination<GetUserEmailLogDto>> GetAllWithPaginationAsync(UserEmailLogFilter filter);
    Task<GetUserEmailLogDetailDto> GetByIdAsync(Guid id);
}
