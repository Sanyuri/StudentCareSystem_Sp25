using AutoMapper;

using Serilog;

using StudentCareSystem.Application.Commons.Interfaces;
using StudentCareSystem.Application.Commons.Models.Students;
using StudentCareSystem.Application.Commons.Utilities;
using StudentCareSystem.Domain.Entities;
using StudentCareSystem.Domain.Enums;
using StudentCareSystem.Domain.Helpers;
using StudentCareSystem.Domain.Interfaces;
using StudentCareSystem.Infrastructure.ExternalServices;
using StudentCareSystem.Infrastructure.Specifications;
using StudentCareSystem.Infrastructure.Utilities;

namespace StudentCareSystem.Application.Services;
public class StudentService(
    IFapService fapService,
    IMapper mapper,
    IUnitOfWork unitOfWork
) : IStudentService
{
    public async Task<GetStudentDto> GetByStudentCodeAsync(string studentCode)
    {
        var student = await unitOfWork.StudentRepository.GetByStudentCodeAsync(studentCode);
        return mapper.Map<GetStudentDto>(student);
    }

    public async Task<Pagination<GetStudentDto>> GetAllWithPaginationAsync(StudentFilter filter)
    {
        var query = filter.Query?.Trim();
        var specification = new SpecificationBuilder<Student>()
            .Where(a =>
                (string.IsNullOrEmpty(query)
                    || a.StudentCode.Contains(query)
                    || a.StudentName.Contains(query)
                )
                && (string.IsNullOrEmpty(filter.Class) || a.Class == filter.Class)
                && (string.IsNullOrEmpty(filter.Major) || a.Major == filter.Major)
                && (!filter.StatusCode.HasValue || a.StatusCode == filter.StatusCode)
                && (!filter.CurrentTermNo.HasValue || a.CurrentTermNo == filter.CurrentTermNo)
            )
            .OrderByDescending(a => a.StudentCode)
            .ApplyPaging(filter.PageNumber, filter.PageSize)
            .Build();

        var result = await unitOfWork.StudentRepository.GetAllWithPaginationAsync(specification);
        return mapper.Map<Pagination<GetStudentDto>>(result);
    }

    public async Task ScanStudentAsync()
    {
        int pageSize = 500;
        var totalRecords = await fapService.GetTotalStudentRecordsAsync();
        var totalPages = (int)Math.Ceiling((double)totalRecords / pageSize);
        var studentFromDatabase = await unitOfWork.StudentRepository.GetAllAsync();

        var pageNumbers = Enumerable.Range(1, totalPages).ToList();

        await BatchHelper.ProcessInBatchesAsync(
            pageNumbers,
            1, // batch size 1, each batch is a page
            async (pages, batchIndex, totalBatches) =>
            {
                int pageNumber = pages[0];
                var students = await fapService.GetStudentsAsync(pageSize, pageNumber);
                foreach (var student in students)
                {
                    var existingStudent = studentFromDatabase.FirstOrDefault(s => s.StudentCode.Equals(student.RollNumber, StringComparison.OrdinalIgnoreCase));
                    if (existingStudent == null)
                    {
                        if (!string.IsNullOrEmpty(student.Email) && !EmailHelper.IsValidEmail(student.Email))
                        {
                            Log.Warning("Invalid email format for student {StudentCode}: {Email}", student.RollNumber, student.Email);
                        }
                        await unitOfWork.StudentRepository.AddAsync(mapper.Map<Student>(student));
                    }
                    else
                    {
                        existingStudent.StudentCode = student.RollNumber.ToUpper();
                        existingStudent.Email = student.Email;
                        existingStudent.Class = student.Class;
                        existingStudent.Major = student.Major;
                        existingStudent.Gender = student.Gender;
                        existingStudent.Progress = student.Progress;
                        existingStudent.StudentName = student.Fullname;
                        existingStudent.MobilePhone = student.MobilePhone;
                        existingStudent.ParentPhone = student.ParentPhone;
                        existingStudent.CurrentTermNo = student.CurrentTermNo;
                        existingStudent.Specialization = student.Specialization;
                        existingStudent.StatusCode = Enum.Parse<StudentStatus>(student.StatusCode);
                        unitOfWork.StudentRepository.Update(existingStudent);
                    }
                }
            },
            "Student Scan"
        );

        await unitOfWork.SaveChangesAsync();
    }
}
