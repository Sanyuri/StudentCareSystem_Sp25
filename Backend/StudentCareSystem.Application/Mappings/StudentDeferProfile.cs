using StudentCareSystem.Application.Commons.Models.Defers;
using StudentCareSystem.Domain.Entities;
using StudentCareSystem.Infrastructure.Models.StudentLeaveApplications;

namespace StudentCareSystem.Application.Mappings;

public class StudentDeferProfile : MapProfile
{
    public StudentDeferProfile()
    {
        CreateMap<FapStudentDeferData, StudentDefer>()
        .ForMember(dest => dest.DefermentDate, opt => opt.MapFrom(src => src.CreatedDate))
        .ForMember(dest => dest.StudentCode, opt => opt.MapFrom(src => src.RollNumber.ToUpper()))
        .ForMember(dest => dest.StudentDeferType, opt => opt.MapFrom(src => src.TypeName))
        .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.AppStatus))
        ;

        CreateMap<GetStudentDeferDto, StudentDefer>().ReverseMap();
    }
}
