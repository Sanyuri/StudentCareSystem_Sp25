using StudentCareSystem.Application.Commons.Models.PsychologyNoteTypes;
using StudentCareSystem.Domain.Entities;

namespace StudentCareSystem.Application.Mappings;

public class PsychologyNoteTypeProfile : MapProfile
{
    public PsychologyNoteTypeProfile()
    {
        CreateMap<PsychologyNoteType, GetPsychologyNoteTypeDto>();
        CreateMap<CreatePsychologyNoteTypeDto, PsychologyNoteType>();
    }
}
