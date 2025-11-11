using StudentCareSystem.Application.Commons.Models.Notes;
using StudentCareSystem.Domain.Entities;

namespace StudentCareSystem.Application.Mappings;

public class StudentNoteProfile : MapProfile
{
    public StudentNoteProfile()
    {
        CreateMap<GetStudentNoteDto, StudentNote>().ReverseMap();
        CreateMap<StudentNote, CreateStudentNoteDto>().ReverseMap();
        CreateMap<ImportStudentNoteDto, StudentNote>();
    }
}
