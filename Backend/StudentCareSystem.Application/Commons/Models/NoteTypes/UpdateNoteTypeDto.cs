namespace StudentCareSystem.Application.Commons.Models.NoteTypes;

public class UpdateNoteTypeDto
{
    public Guid Id { get; set; }
    public string VietnameseName { get; set; } = string.Empty;
    public string EnglishName { get; set; } = string.Empty;
}
