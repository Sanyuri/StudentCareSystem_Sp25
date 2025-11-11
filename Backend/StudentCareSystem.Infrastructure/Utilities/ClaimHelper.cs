using System.Security.Claims;

using Microsoft.AspNetCore.Http;

using StudentCareSystem.Domain.Enums;

namespace StudentCareSystem.Infrastructure.Utilities;

public static class ClaimsHelper
{
    public static string? GetClaimValue(IHttpContextAccessor httpContextAccessor, string claimType)
    {
        var httpContext = httpContextAccessor.HttpContext;
        var claim = httpContext?.User?.Claims?.FirstOrDefault(c => c.Type == claimType);
        return claim?.Value;
    }

    public static Guid GetUserId(IHttpContextAccessor httpContextAccessor)
    {
        // Get user id from token
        return Guid.Parse(httpContextAccessor.HttpContext?.User.FindFirstValue(ClaimTypes.NameIdentifier)
          ?? throw new ArgumentNullException(nameof(httpContextAccessor)));
    }

    public static string? GetUserName(IHttpContextAccessor httpContextAccessor)
    {
        return GetClaimValue(httpContextAccessor, ClaimTypes.Name);
    }

    public static string? GetUserEmail(IHttpContextAccessor httpContextAccessor)
    {
        return GetClaimValue(httpContextAccessor, ClaimTypes.Email);
    }

    public static RoleType GetUserRole(IHttpContextAccessor httpContextAccessor)
    {
        var roleName = GetClaimValue(httpContextAccessor, ClaimTypes.Role);
        if (Enum.TryParse<RoleType>(roleName, out var role))
        {
            return role;
        }
        throw new ArgumentException($"Invalid role type: {roleName}");
    }

    public static string? GetTenantIdentifier(IHttpContextAccessor httpContextAccessor)
    {
        return GetClaimValue(httpContextAccessor, "Identifier");
    }
}

