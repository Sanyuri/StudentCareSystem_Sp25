using StudentCareSystem.Application.Commons.Models.StudentNeedCares;
using StudentCareSystem.Domain.Enums;
using StudentCareSystem.Domain.Helpers;

namespace StudentCareSystem.Application.Commons.Interfaces;

public interface IStudentNeedCareService
{
    Task<Pagination<GetStudentNeedCareDto>> GetAllWithPaginationAsync(StudentNeedCareFilter filter);
    Task<GetStudentNeedCareDto> AddAsync(CreateStudentNeedCareDto studentNeedCareDto);
    Task<GetStudentNeedCareDto> GetByIdAsync(Guid id);
    Task UpdateAsync(UpdateStudentNeedCareDto studentNeedCareDto);
    Task DeleteAsync(Guid id);
    Task ScanStudentNeedCareAsync(int numberOfStudentNeedCare);
    Task<Pagination<GetStudentNeedCareDto>> GetScannedListAsync(StudentNeedCareFilter filter);
    Task DeleteFromScannedListAsync(string studentCodes);
    Task ConfirmScannedListAsync();
    Task AnalyzeStudentNeedCareAsync(string semesterName);
    Task ChangeStatusAsync(ChangeCareStatusDto changeStatusDto);
    Task<IEnumerable<Dictionary<CareStatus, int>>> GetCareStatusCountBySemesterAsync(string semesterName);
    Task FinalEvaluateStudentCareAsync(FinalEvaluateStudentCareDto finalEvaluateStudentCareDto);
    Task UpdateRankAsync(string semesterName);
}
