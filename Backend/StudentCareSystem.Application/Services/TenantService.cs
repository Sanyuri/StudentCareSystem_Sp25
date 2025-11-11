using Finbuckle.MultiTenant.Abstractions;

using StudentCareSystem.Application.Commons.Interfaces;
using StudentCareSystem.Infrastructure.Models.Tenant;

namespace StudentCareSystem.Application.Services;
public class TenantService(IMultiTenantStore<AppTenantInfo> tenantStore) : ITenantService
{
    public async Task<IEnumerable<AppTenantInfo>> GetAllAsync()
    {
        return await tenantStore.GetAllAsync();
    }

    public async Task<AppTenantInfo?> GetByIdentifierAsync(string id)
    {
        return await tenantStore.TryGetByIdentifierAsync(id);
    }
}
