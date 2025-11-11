using StudentCareSystem.Application.Commons.Models.Attendances;
using StudentCareSystem.Domain.Entities;

namespace StudentCareSystem.Application.Mappings;

public class AttendanceHistoryProfile : MapProfile
{
    public AttendanceHistoryProfile()
    {
        CreateMap<AttendanceHistory, GetAttendanceHistoryDto>();

    }
}
