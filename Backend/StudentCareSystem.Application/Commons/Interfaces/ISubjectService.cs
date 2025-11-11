using StudentCareSystem.Application.Commons.Models.Subjects;
using StudentCareSystem.Domain.Helpers;

namespace StudentCareSystem.Application.Commons.Interfaces;

public interface ISubjectService
{
    Task ScanSubjectAsync();
    Task<Pagination<GetSubjectDto>> GetAllWithPaginationAsync(StudentSubjectFilter filter);
    Task<GetSubjectDto> GetByIdAsync(Guid id);
    Task AddAttendanceFreeSubjectsAsync(AddAttendanceFreeSubjectsDto attendanceFreeSubjectsDto);
    Task UpdateSubjectAsync(UpdateSubjectDto updateSubjectDto);

}
