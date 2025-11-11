using StudentCareSystem.Domain.Enums;

namespace StudentCareSystem.Infrastructure.Attributes;

[AttributeUsage(AttributeTargets.Method, AllowMultiple = false)]
public class RequiredPermissionAttribute(PermissionType permission) : Attribute
{
    public string Permission { get; } = permission.ToString();
}
