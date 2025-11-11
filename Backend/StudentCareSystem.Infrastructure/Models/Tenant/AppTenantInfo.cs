using System.ComponentModel.DataAnnotations;

using Finbuckle.MultiTenant.Abstractions;

using Newtonsoft.Json;

namespace StudentCareSystem.Infrastructure.Models.Tenant;

public class AppTenantInfo : ITenantInfo
{
    [JsonIgnore]
    public string? Id { get; set; }
    public string? Identifier { get; set; }
    public string? Name { get; set; }
    [Required]
    public string ConnectionString { get; set; } = string.Empty;
    public int AdjustedExecutionTime { get; set; } = 0;
    public bool IsException { get; set; } = false;
    public FapAccount FapAccount { get; set; } = new FapAccount();
}

public class FapAccount
{
    [Required]
    public string CampusCode { get; set; } = string.Empty;
    [Required]
    public string Username { get; set; } = string.Empty;
    [Required]
    public string Password { get; set; } = string.Empty;
}
