using AutoMapper;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

using StudentCareSystem.Application.Commons.Interfaces;
using StudentCareSystem.Application.Commons.Models.Apis;
using StudentCareSystem.Application.Commons.Models.Tenants;
using StudentCareSystem.Domain.Constants;
using StudentCareSystem.Infrastructure.Attributes;
using StudentCareSystem.Infrastructure.Models.Tenant;

namespace StudentCareSystem.API.Controllers;

[AllowAnonymous]
[SkipChecksum]
public class TenantsController(ITenantService tenantService, IMapper mapper) : BaseController
{

    [HttpGet]
    public async Task<IActionResult> GetTenants()
    {
        var result = mapper.Map<IEnumerable<AppTenantInfo>, IEnumerable<TenantResponse>>(await tenantService.GetAllAsync());
        return Ok(new ApiResponse<IEnumerable<TenantResponse>>(
            200,
            MessageDescription.ApiResponseMessageDescription.Success,
            result));
    }
}
