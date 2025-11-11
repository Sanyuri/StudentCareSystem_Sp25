using StudentCareSystem.Application.Commons.Models.PsychologyNoteDetails;
using StudentCareSystem.Domain.Entities;

namespace StudentCareSystem.Application.Mappings;

public class PsychologyNoteDetailProfile : MapProfile
{
    public PsychologyNoteDetailProfile()
    {
        CreateMap<PsychologyNoteDetail, GetPsychologyNoteDetailDto>();
        CreateMap<CreatePsychologyNoteDetailDto, PsychologyNoteDetail>();
    }
}
