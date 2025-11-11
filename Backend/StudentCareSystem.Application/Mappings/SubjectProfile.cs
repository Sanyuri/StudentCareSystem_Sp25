using StudentCareSystem.Application.Commons.Models.Subjects;
using StudentCareSystem.Domain.Entities;
using StudentCareSystem.Infrastructure.Models.Subjects;

namespace StudentCareSystem.Application.Mappings;

public class SubjectProfile : MapProfile
{
    public SubjectProfile()
    {
        CreateMap<FapSubjectData, Subject>()
        .ForMember(dest => dest.EnglishName, opt => opt.MapFrom(src => src.SubjectName))
        .ForMember(dest => dest.VietnameseName, opt => opt.MapFrom(src => src.SubjectV));

        CreateMap<Subject, GetSubjectDto>();
    }
}
