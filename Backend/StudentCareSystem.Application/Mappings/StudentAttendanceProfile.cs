using StudentCareSystem.Application.Commons.Models.Attendances;
using StudentCareSystem.Domain.Entities;
using StudentCareSystem.Infrastructure.Models.Attendances;

namespace StudentCareSystem.Application.Mappings;

public class StudentAttendanceProfile : MapProfile
{
    public StudentAttendanceProfile()
    {
        CreateMap<FapStudentAttendanceData, StudentAttendance>()
            .ForMember(dest => dest.SubjectCode, opt => opt.MapFrom(src => src.Subject))
            .ForMember(dest => dest.TotalAbsences, opt => opt.MapFrom(src => src.TotalAbsences))
            .ForMember(dest => dest.TotalSlots, opt => opt.MapFrom(src => src.TotalSlots))
            .ForMember(dest => dest.AbsenceRate, opt => opt.MapFrom(src => Math.Round(src.AbsenceRate)))
            .ForMember(dest => dest.StudentCode, opt => opt.MapFrom(src => src.RollNumber.ToUpper()))
            .ReverseMap();

        CreateMap<StudentAttendance, GetStudentAttendanceDto>()
            .ForMember(dest => dest.CurrentTermNo, opt => opt.MapFrom(src => src.Student != null ? src.Student.CurrentTermNo : 0))
            .ForMember(dest => dest.UpdatedPeriod, opt => opt.MapFrom(src => src.UpdatedAt != null ? src.UpdatedAt : src.CreatedAt));
    }

}
