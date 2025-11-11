using StudentCareSystem.Application.Commons.Models.Points;
using StudentCareSystem.Domain.Entities;
using StudentCareSystem.Domain.Enums;
using StudentCareSystem.Infrastructure.Models.StudentPoints;

namespace StudentCareSystem.Application.Mappings;

public class StudentPointProfile : MapProfile
{
    public StudentPointProfile()
    {
        CreateMap<FapStudentPoint, StudentPoint>()
        .ForMember(dest => dest.StudentCode, opt => opt.MapFrom(src => src.RollNumber.ToUpper()))
        .ForMember(dest => dest.AverageMark, opt => opt.MapFrom(src => Math.Round(src.AverageMark ?? 0, 1)))
        .ForMember(dest => dest.PointStatus, opt => opt.MapFrom(src => GetStudentStatus(src)))
        .ForMember(dest => dest.FailReason, opt => opt.MapFrom(src => GetFailReason(src)));

        CreateMap<StudentPoint, GetStudentPointDto>()
        .ForMember(dest => dest.UpdatedAt, opt => opt.MapFrom(src => src.UpdatedAt ?? src.CreatedAt));
    }

    private static PointStatus GetStudentStatus(FapStudentPoint studentPoint)
    {
        if (studentPoint.Status)
            return PointStatus.Pass;
        if (studentPoint.EndDate.Date.AddDays(14) > DateTime.UtcNow.Date
            && !studentPoint.IsAttendanceFail
            && !studentPoint.IsSuspended)
            return PointStatus.None;
        return PointStatus.Fail;
    }

    private static FailReason GetFailReason(FapStudentPoint studentPoint)
    {
        // Check point status first
        if (GetStudentStatus(studentPoint) == PointStatus.Fail)
        {
            if (studentPoint.IsAttendanceFail)
                return FailReason.AttendanceFail;
            if (studentPoint.IsSuspended)
                return FailReason.Suspension;
            if (studentPoint.AverageMark < 4.0)
                return FailReason.InsufficientPoints;
        }
        return FailReason.None;
    }
}
