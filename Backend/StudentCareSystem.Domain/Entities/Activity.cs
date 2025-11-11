using System.ComponentModel.DataAnnotations.Schema;

using StudentCareSystem.Domain.Enums;
using StudentCareSystem.Domain.Interfaces;

namespace StudentCareSystem.Domain.Entities;

public class Activity : BaseEntity<Guid>
{
    public string ActivityDescription { get; set; } = string.Empty;
    [Column(TypeName = "nvarchar(100)")]
    public ActivityType ActivityType { get; set; }
    public Guid UserId { get; set; }
    [ForeignKey("UserId")]
    public virtual User? User { get; set; }

}

