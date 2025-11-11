using AutoMapper;

using StudentCareSystem.Application.Commons.Models.NoteTypes;
using StudentCareSystem.Domain.Entities;


namespace StudentCareSystem.Application.Mappings;

public class NoteTypeProfile : Profile
{
    public NoteTypeProfile()
    {
        CreateMap<NoteType, GetNoteTypeDto>();
        CreateMap<CreateNoteTypeDto, NoteType>();
        CreateMap<UpdateNoteTypeDto, NoteType>();
    }
}
