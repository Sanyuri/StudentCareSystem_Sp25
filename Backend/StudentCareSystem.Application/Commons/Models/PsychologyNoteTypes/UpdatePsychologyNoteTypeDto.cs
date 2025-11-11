namespace StudentCareSystem.Application.Commons.Models.PsychologyNoteTypes;

public class UpdatePsychologyNoteTypeDto
{
    public Guid Id { get; set; }
    public string VietnameseName { get; set; } = string.Empty;
    public string EnglishName { get; set; } = string.Empty;
}
