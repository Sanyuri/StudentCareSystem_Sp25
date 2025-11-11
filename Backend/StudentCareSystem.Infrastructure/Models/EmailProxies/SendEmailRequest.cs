namespace StudentCareSystem.Infrastructure.Models.EmailProxies;

public class SendEmailRequest
{
    public Dictionary<string, object> Data { get; set; } = [];
    public List<string> Bcc { get; set; } = [];
    public bool IsRaw { get; set; } = true;
    public string Project { get; set; } = "StudentCareSystem";
    public string Template { get; set; } = string.Empty;
    public string CampusCode { get; set; } = string.Empty;
    public string Subject { get; set; } = string.Empty;
    public List<string> Receiver { get; set; } = [];
    public List<string> Cc { get; set; } = [];
    public string? ReplyToAddress { get; set; }
    public string Content { get; set; } = string.Empty;
    public Guid IdentifierCode { get; set; }
    public string Keys { get; set; } = string.Empty;
}
