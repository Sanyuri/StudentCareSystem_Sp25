namespace StudentCareSystem.Infrastructure.Models.EmailProxies;

public class EmailProxyLog
{
    public string Id { get; set; } = string.Empty;
    public string[] Bcc { get; set; } = [];
    public Guid IdentifierCode { get; set; }
    public string Subject { get; set; } = string.Empty;
    public string Project { get; set; } = string.Empty;
    public bool Status { get; set; }
    public string CampusCode { get; set; } = string.Empty;
    public DateTime? Created { get; set; }
    public DateTime? Updated { get; set; }
    public string[] Recipient { get; set; } = [];
}
