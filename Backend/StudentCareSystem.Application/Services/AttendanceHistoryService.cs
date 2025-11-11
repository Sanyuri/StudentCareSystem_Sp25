using AutoMapper;

using StudentCareSystem.Application.Commons.Interfaces;
using StudentCareSystem.Application.Commons.Models.Attendances;
using StudentCareSystem.Domain.Entities;
using StudentCareSystem.Domain.Interfaces;
using StudentCareSystem.Infrastructure.Specifications;

namespace StudentCareSystem.Application.Services;

public class AttendanceHistoryService(
    IMapper mapper,
    IUnitOfWork unitOfWork
) : IAttendanceHistoryService
{
    public async Task<IEnumerable<GetAttendanceHistoryDto>> GetAllByStudentAttendanceIdAsync(Guid studentAttendanceId)
    {
        var attendanceHistorySpecification = new SpecificationBuilder<AttendanceHistory>()
            .Where(x => x.StudentAttendanceId == studentAttendanceId)
            .OrderBy(x => x.CreatedAt)
            .Build();
        var result = await unitOfWork.AttendanceHistoryRepository.GetAllAsync(attendanceHistorySpecification);
        return mapper.Map<IEnumerable<GetAttendanceHistoryDto>>(result);
    }
}
