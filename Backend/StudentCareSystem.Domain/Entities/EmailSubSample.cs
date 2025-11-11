using System.ComponentModel.DataAnnotations.Schema;

using StudentCareSystem.Domain.Enums;
using StudentCareSystem.Domain.Interfaces;

namespace StudentCareSystem.Domain.Entities;

public class EmailSubSample : BaseEntity<Guid>
{
    public string Name { get; set; } = string.Empty;
    public string VietnameseDescription { get; set; } = string.Empty;
    public string EnglishDescription { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    [Column(TypeName = "nvarchar(50)")]
    public EmailType EmailType { get; set; }
}

