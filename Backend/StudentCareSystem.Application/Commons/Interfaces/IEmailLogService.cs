using StudentCareSystem.Application.Commons.Models.EmailLogs;
using StudentCareSystem.Domain.Helpers;

namespace StudentCareSystem.Application.Commons.Interfaces;

public interface IEmailLogService
{
    Task<Pagination<GetEmailLogDto>> GetAllWithPaginationAsync(EmailLogFilter filter);
    Task<GetEmailLogDetailDto> GetByIdAsync(Guid id);
}
