using AutoMapper;

using StudentCareSystem.Application.Commons.Interfaces;
using StudentCareSystem.Domain.Entities;
using StudentCareSystem.Domain.Enums;
using StudentCareSystem.Domain.Interfaces;
using StudentCareSystem.Infrastructure.ExternalServices;
using StudentCareSystem.Infrastructure.Specifications;
using StudentCareSystem.Infrastructure.Utilities;


namespace StudentCareSystem.Application.Services;
public class StudentSubjectService(
    IMapper mapper,
    IFapService fapService,
    IStudentRepository studentRepository,
    IStudentSubjectRepository studentSubjectRepository
) : IStudentSubjectService
{

    public async Task ScanStudentSubjectAsync()
    {
        var studentCode = await studentRepository.GetAllStudentCodeByStatusCodesAsync(
            [StudentStatus.HD, StudentStatus.HL, StudentStatus.CO, StudentStatus.BL]);
        await BatchHelper.ProcessInBatchesAsync(
            studentCode,
            150,
            async (chunk, batchIndex, totalBatches) =>
            {
                var studentSubjectsFromFap = await fapService.GetStudentSubjectsAsync(chunk);
                var newStudentSubjects = mapper.Map<IEnumerable<StudentSubject>>(studentSubjectsFromFap);
                var studentSubjectSpecification = new SpecificationBuilder<StudentSubject>()
                    .Where(s => chunk.Contains(s.StudentCode))
                    .Build();
                var oldStudentSubjects = await studentSubjectRepository.GetAllAsync(studentSubjectSpecification);
                await ManageStudentSubjectAsync(newStudentSubjects, oldStudentSubjects);
            },
            "Student Subject Scan"
        );
    }


    private async Task ManageStudentSubjectAsync(IEnumerable<StudentSubject> newStudentSubjects, IEnumerable<StudentSubject> oldStudentSubjects)
    {
        var studentSubjectsToInsert = new List<StudentSubject>();
        var studentSubjectsToUpdate = new List<StudentSubject>();
        var studentSubjectsToDelete = new List<StudentSubject>();

        // Dùng Dictionary thay cho HashSet để truy xuất nhanh hơn
        var oldStudentSubjectDict = oldStudentSubjects.ToDictionary(
            s => (s.StudentCode, s.SubjectCode, s.ClassName, s.StartDate),
            s => s
        );

        foreach (var newStudentSubject in newStudentSubjects)
        {
            // Nếu tồn tại trong danh sách cũ thì cập nhật
            if (oldStudentSubjectDict.TryGetValue((
                newStudentSubject.StudentCode,
                newStudentSubject.SubjectCode,
                newStudentSubject.ClassName,
                newStudentSubject.StartDate), out var oldStudentSubject))
            {
                newStudentSubject.Id = oldStudentSubject.Id;
                studentSubjectsToUpdate.Add(newStudentSubject);
            }
            else
            {
                studentSubjectsToInsert.Add(newStudentSubject);
            }
        }
        var newStudentSubjectSet = new HashSet<(string, string, string, DateTime)>(
            newStudentSubjects.Select(s => (s.StudentCode, s.SubjectCode, s.ClassName, s.StartDate))
        );

        foreach (var oldStudentSubject in oldStudentSubjects)
        {
            if (!newStudentSubjectSet.Contains((
                oldStudentSubject.StudentCode,
                oldStudentSubject.SubjectCode,
                oldStudentSubject.ClassName,
                oldStudentSubject.StartDate)))
            {
                studentSubjectsToDelete.Add(oldStudentSubject);
            }
        }

        // Thực hiện thao tác với DB
        await studentSubjectRepository.AddBulkAsync(studentSubjectsToInsert);
        await studentSubjectRepository.UpdateBulkAsync(studentSubjectsToUpdate);
        await studentSubjectRepository.DeleteBulkAsync(studentSubjectsToDelete);
    }


    public async Task<DateTime?> GetLastUpdatedDateAsync()
    {
        var specification = new SpecificationBuilder<StudentSubject>()
            .OrderByDescending(s => s.UpdatedAt ?? s.CreatedAt)
            .Build();
        var studentDefer = await studentSubjectRepository.FirstOrDefaultAsync(specification);
        return studentDefer?.UpdatedAt ?? studentDefer?.CreatedAt;
    }

}
