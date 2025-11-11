using StudentCareSystem.Application.Commons.Models.Tenants;
using StudentCareSystem.Infrastructure.Models.Tenant;

namespace StudentCareSystem.Application.Mappings;

public class TenantProfile : MapProfile
{
    public TenantProfile()
    {
        CreateMap<AppTenantInfo, TenantResponse>().ReverseMap();
    }
}
