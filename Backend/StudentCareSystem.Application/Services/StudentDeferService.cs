using AutoMapper;

using Microsoft.EntityFrameworkCore;

using StudentCareSystem.Application.Commons.Interfaces;
using StudentCareSystem.Application.Commons.Models.Defers;
using StudentCareSystem.Domain.Entities;
using StudentCareSystem.Domain.Helpers;
using StudentCareSystem.Domain.Interfaces;
using StudentCareSystem.Infrastructure.ExternalServices;
using StudentCareSystem.Infrastructure.Specifications;

namespace StudentCareSystem.Application.Services;

public class StudentDeferService(
    ISemesterRepository semesterRepository,
    IStudentDeferRepository studentDeferRepository,
    IFapService fapService,
    IMapper mapper
) : IStudentDeferService
{

    public async Task ScanStudentDeferBySemesterAsync(Semester semester)
    {
        var nextSemester = await semesterRepository.GetNextSemesterAsync(semester) ?? new()
        {
            StartDate = semester.EndDate.AddDays(20),
            EndDate = semester.EndDate.AddDays(144),
            SemesterName = "The next semester of " + semester.SemesterName
        };

        // The buffer time is 14 days before the start date of the next semester and 14 days after the end date of the current semester
        var startDate = semester.StartDate.AddDays(14);
        var endDate = nextSemester.StartDate.AddDays(-14);

        var studentDefersFromFap = await fapService.GetStudentDefersAsync(startDate, endDate);

        var latestStudentDefersFromFap = studentDefersFromFap
            .GroupBy(s => s.RollNumber)
            .Select(s => s.OrderByDescending(a => a.CreatedDate).First())
            .ToList();

        var latestStudentDefers = mapper.Map<IEnumerable<StudentDefer>>(latestStudentDefersFromFap);
        var studentCodes = latestStudentDefers.Select(s => s.StudentCode).ToList();

        if (studentCodes.Count == 0) return;

        var studentDefersFromDatabase = await studentDeferRepository.GetAllAsync(
            new SpecificationBuilder<StudentDefer>()
            .Where(s =>
                studentCodes.Contains(s.StudentCode)
                && s.DefermentDate >= startDate
                && s.DefermentDate <= endDate
                )
            .Build()
        );

        var studentDefersFromDbDictionary = studentDefersFromDatabase
            .ToDictionary(s => s.StudentCode, s => s);
        var studentDefersFromFapDictionary = latestStudentDefers
            .ToDictionary(s => s.StudentCode, s => s);

        IEnumerable<StudentDefer> studentDefersToUpdate = [];
        IEnumerable<StudentDefer> studentDefersToAdd = [];
        IEnumerable<StudentDefer> studentDefersToDelete;
        // Compare the deferment date and status, if the deferment date is newer or status is different, update it
        foreach (var studentDefer in latestStudentDefers)
        {
            studentDefer.DeferredSemesterName = nextSemester.SemesterName;
            studentDefer.StartDate = nextSemester.StartDate;
            studentDefer.EndDate = nextSemester.EndDate;
            if (studentDefersFromDbDictionary.TryGetValue(studentDefer.StudentCode, out var existingStudentDefer))
            {
                if (studentDefer.DefermentDate > existingStudentDefer.DefermentDate ||
                    studentDefer.Status != existingStudentDefer.Status)
                {
                    existingStudentDefer.DefermentDate = studentDefer.DefermentDate;
                    existingStudentDefer.Description = studentDefer.Description;
                    existingStudentDefer.Status = studentDefer.Status;
                    existingStudentDefer.DeferredSemesterName = studentDefer.DeferredSemesterName;
                    existingStudentDefer.StartDate = studentDefer.StartDate;
                    existingStudentDefer.EndDate = studentDefer.EndDate;
                    studentDefersToUpdate = studentDefersToUpdate.Append(existingStudentDefer);
                }
            }
            else
            {
                studentDefersToAdd = studentDefersToAdd.Append(studentDefer);
            }
        }

        // Check for student defers that are in the database but not in the latest data from FAP
        studentDefersToDelete = [.. studentDefersFromDatabase.Where(studentDefer => !studentDefersFromFapDictionary.ContainsKey(studentDefer.StudentCode))];


        if (studentDefersToUpdate.Any())
        {
            await studentDeferRepository.UpdateBulkAsync(studentDefersToUpdate);
        }
        if (studentDefersToAdd.Any())
        {
            await studentDeferRepository.AddBulkAsync(studentDefersToAdd);
        }
        if (studentDefersToDelete.Any())
        {
            await studentDeferRepository.DeleteBulkAsync(studentDefersToDelete);
        }

    }

    public async Task<Pagination<GetStudentDeferDto>> GetAllWithPaginationAsync(StudentDeferFilter filter)
    {
        var query = filter.Query?.Trim();
        var specification = new SpecificationBuilder<StudentDefer>()
            .Where(s =>
                (string.IsNullOrEmpty(query)
                    || s.StudentCode.Contains(query)
                    || (s.Student != null && s.Student.StudentName.Contains(query))
                )
                && (!filter.Status.HasValue || s.Status == filter.Status)
                && (!filter.StartDate.HasValue || s.DefermentDate >= filter.StartDate)
                && (!filter.EndDate.HasValue || s.DefermentDate <= filter.EndDate)
                && (filter.Semesters == null || !filter.Semesters.Any() || filter.Semesters.Contains(s.DeferredSemesterName))
            )
            .Include(s => s.Include(x => x.Student))
            .OrderByDescending(s => s.DefermentDate)
            .ApplyPaging(filter.PageNumber, filter.PageSize)
            .Build();
        var studentDefers = await studentDeferRepository.GetAllWithPaginationAsync(specification);
        return mapper.Map<Pagination<GetStudentDeferDto>>(studentDefers);
    }

    public async Task<DateTime?> GetLastUpdatedDateAsync()
    {
        var specification = new SpecificationBuilder<StudentDefer>()
            .OrderByDescending(s => s.UpdatedAt ?? s.CreatedAt)
            .Build();
        var studentDefer = await studentDeferRepository.FirstOrDefaultAsync(specification);
        return studentDefer?.UpdatedAt ?? studentDefer?.CreatedAt;
    }

}
