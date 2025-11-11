using StudentCareSystem.Application.Commons.Models.PsychologyNotes;
using StudentCareSystem.Domain.Entities;

namespace StudentCareSystem.Application.Mappings;

public class PsychologyNoteProfile : MapProfile
{
    public PsychologyNoteProfile()
    {
        CreateMap<PsychologyNote, GetPsychologyNoteDto>();
        CreateMap<CreatePsychologyNoteDto, PsychologyNote>();
    }
}
