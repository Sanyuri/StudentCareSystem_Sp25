using StudentCareSystem.Domain.Entities;
using StudentCareSystem.Domain.Enums;

namespace StudentCareSystem.Domain.Interfaces;

public interface IEmailLogRepository : IBaseRepository<EmailLog>
{
    Task<Dictionary<EmailState, int>> CountByDateAsync(DateTime dateTime);
}
