namespace StudentCareSystem.Application.Commons.Models.NoteTypes;

public class GetNoteTypeDto
{
    public Guid Id { get; set; }
    public string VietnameseName { get; set; } = string.Empty;
    public string EnglishName { get; set; } = string.Empty;
    public string DefaultNoteType { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}
