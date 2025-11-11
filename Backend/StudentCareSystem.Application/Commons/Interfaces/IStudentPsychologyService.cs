using Application.Commons.Models.StudentPsychology;

using StudentCareSystem.Application.Commons.Models.StudentPsychologies;
using StudentCareSystem.Domain.Helpers;

namespace StudentCareSystem.Application.Commons.Interfaces;

public interface IStudentPsychologyService
{
    Task<GetStudentPsychologyDto> AddAsync(CreateStudentPsychologyDto studentPsychologyDto);
    Task<Pagination<GetStudentPsychologyDto>> GetAllAsync(StudentPsychologyFilter filter);
    Task<GetStudentPsychologyDto> GetByIdAsync(Guid id);
    Task<GetStudentPsychologyDto> GetByStudentCodeAsync(string studentCode);
    Task UpdatePasswordAsync(UpdateStudentPsychologyPasswordRequest data);
    Task ForgetPasswordAsync(ForgetPasswordRequest data);
    Task<VerifyPsychologyResponse> VerifyPsychologyAsync(VerifyPsychologyRequest data);
    Task DeleteAsync(DeleteStudentPsychologyDto data);
}
