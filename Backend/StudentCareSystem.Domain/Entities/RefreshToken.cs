using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace StudentCareSystem.Domain.Entities;

public class RefreshToken
{
    [Key]
    public Guid Id { get; set; }
    public string Token { get; set; } = string.Empty;
    public DateTime ExpiryTime { get; set; }
    public DateTime CreatedAt { get; set; }
    public string CreatedByIp { get; set; } = string.Empty;
    public bool IsExpired => DateTime.UtcNow >= ExpiryTime;
    public Guid UserId { get; set; }
    [ForeignKey("UserId")]
    public virtual User? User { get; set; }
}

