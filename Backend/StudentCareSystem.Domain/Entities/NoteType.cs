using System.ComponentModel.DataAnnotations.Schema;

using StudentCareSystem.Domain.Enums;
using StudentCareSystem.Domain.Interfaces;

namespace StudentCareSystem.Domain.Entities;

public class NoteType : BaseEntity<Guid>
{
    public string EnglishName { get; set; } = string.Empty;
    public string VietnameseName { get; set; } = string.Empty;
    [Column(TypeName = "nvarchar(50)")]
    public DefaultNoteType DefaultNoteType { get; set; } = DefaultNoteType.Unknown;
    public virtual ICollection<StudentNote> StudentNotes { get; set; } = [];
}

