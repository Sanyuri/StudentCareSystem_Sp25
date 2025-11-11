using System.ComponentModel.DataAnnotations.Schema;

using Microsoft.EntityFrameworkCore;

using StudentCareSystem.Domain.Enums;
using StudentCareSystem.Domain.Interfaces;

namespace StudentCareSystem.Domain.Entities;

[Index(nameof(Key))]
public class AppSetting : BaseEntity<Guid>
{
    public string Key { get; set; } = string.Empty;
    public string? Value { get; set; }
    public string VietnameseDescription { get; set; } = string.Empty;
    public string EnglishDescription { get; set; } = string.Empty;
    [Column(TypeName = "nvarchar(10)")]
    public ParameterType ParameterType { get; set; }
}
