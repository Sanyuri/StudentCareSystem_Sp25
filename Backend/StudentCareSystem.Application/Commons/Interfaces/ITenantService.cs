using StudentCareSystem.Infrastructure.Models.Tenant;

namespace StudentCareSystem.Application.Commons.Interfaces;

public interface ITenantService
{
    Task<IEnumerable<AppTenantInfo>> GetAllAsync();
    Task<AppTenantInfo?> GetByIdentifierAsync(string id);
}
