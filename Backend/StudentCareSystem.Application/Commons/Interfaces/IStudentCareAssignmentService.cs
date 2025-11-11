using StudentCareSystem.Application.Commons.Models.StudentNeedCareAssignments;

namespace StudentCareSystem.Application.Commons.Interfaces;

public interface IStudentCareAssignmentService
{
    Task AutoAssignStudentNeedCareToUserAsync();
    Task AutoAssignStudentNeedCareToUserAsync(HashSet<UserAssignmentPercentageDto> userPercentages);
    Task<GetStudentCareAssignmentDto> AddAsync(CreateStudentCareAssignmentDto createStudentCareAssignmentDto);
    Task UpdateAsync(UpdateStudentCareAssignmentDto updateStudentCareAssignmentDto);
    Task<IEnumerable<GetCountStudentCareDto>> GetAssignmentCountByUserBySemesternameAsync(string semesterName);

}
