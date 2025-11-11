using System.Text;

using AutoMapper;

using Microsoft.AspNetCore.Http;

using StudentCareSystem.Application.Commons.Exceptions;
using StudentCareSystem.Application.Commons.Interfaces;
using StudentCareSystem.Application.Commons.Models.Subjects;
using StudentCareSystem.Application.Commons.Utilities;
using StudentCareSystem.Domain.Constants;
using StudentCareSystem.Domain.Entities;
using StudentCareSystem.Domain.Enums;
using StudentCareSystem.Domain.Helpers;
using StudentCareSystem.Domain.Interfaces;
using StudentCareSystem.Infrastructure.ExternalServices;
using StudentCareSystem.Infrastructure.Specifications;
using StudentCareSystem.Infrastructure.Utilities;

namespace StudentCareSystem.Application.Services;
public class SubjectService(
    IHttpContextAccessor httpContextAccessor,
    IFapService fapService,
    IMapper mapper,
    IUnitOfWork unitOfWork
) : ISubjectService
{
    public async Task ScanSubjectAsync()
    {
        var fapSubjects = mapper.Map<List<Subject>>(await fapService.GetFapSubjectsAsync());
        fapSubjects = fapSubjects.GroupBy(x => x.SubjectCode).Select(x => x.First()).ToList();
        var studentSubjectsInDatabase = await unitOfWork.SubjectRepository.GetAllAsync();
        var studentSubjectsToAdd = new List<Subject>();
        var studentSubjectsToUpdate = new List<Subject>();
        foreach (var studentSubjectData in fapSubjects)
        {
            var studentSubject = studentSubjectsInDatabase.FirstOrDefault(x => x.SubjectCode == studentSubjectData.SubjectCode);
            if (studentSubject == null)
            {
                studentSubjectData.TakeAttendance = !SubjectHelper.IsCourseraSubject(studentSubjectData.SubjectCode);
                studentSubjectsToAdd.Add(studentSubjectData);
            }
            else
            {
                studentSubject.IsGraded = studentSubjectData.IsGraded;
                studentSubject.IsRequired = studentSubjectData.IsRequired;
                studentSubject.IsBeforeOjt = studentSubjectData.IsBeforeOjt;
                studentSubject.SubjectGroup = studentSubjectData.SubjectGroup;
                studentSubject.OldSubjectCode = studentSubjectData.OldSubjectCode;
                studentSubject.EnglishName = studentSubjectData.EnglishName;
                studentSubject.VietnameseName = studentSubjectData.VietnameseName;
                studentSubjectsToUpdate.Add(studentSubject);
            }
        }
        await unitOfWork.SubjectRepository.UpdateBulkAsync(studentSubjectsToUpdate);
        await unitOfWork.SubjectRepository.AddBulkAsync(studentSubjectsToAdd);
        await unitOfWork.SaveChangesAsync();
    }

    public async Task<Pagination<GetSubjectDto>> GetAllWithPaginationAsync(StudentSubjectFilter filter)
    {
        filter.Query = filter.Query?.Trim();
        var specification = new SpecificationBuilder<Subject>()
            .Where(x =>
                (string.IsNullOrEmpty(filter.Query) || x.SubjectCode.Contains(filter.Query) || x.EnglishName.Contains(filter.Query)) &&
                (string.IsNullOrEmpty(filter.SubjectGroup) || x.SubjectGroup == filter.SubjectGroup) &&
                (!filter.TakeAttendance.HasValue || x.TakeAttendance == filter.TakeAttendance)
            )
            .ApplyPaging(filter.PageNumber, filter.PageSize)
            .OrderByDescending(x => x.TakeAttendance)
            .Build();
        var result = await unitOfWork.SubjectRepository.GetAllWithPaginationAsync(specification);
        return mapper.Map<Pagination<GetSubjectDto>>(result);
    }

    public async Task AddAttendanceFreeSubjectsAsync(AddAttendanceFreeSubjectsDto attendanceFreeSubjectsDto)
    {
        var specification = new SpecificationBuilder<Subject>()
            .Where(x => attendanceFreeSubjectsDto.StudentSubjectIds.Contains(x.Id))
            .Build();
        var studentSubjects = await unitOfWork.SubjectRepository.GetAllAsync(specification);
        StringBuilder message = new(" ");
        foreach (var studentSubject in studentSubjects)
        {
            studentSubject.TakeAttendance = false;
            message.Append($"[{studentSubject.SubjectCode}], ");
        }
        await unitOfWork.SubjectRepository.UpdateBulkAsync(studentSubjects);

        var userId = ClaimsHelper.GetUserId(httpContextAccessor);
        var activity = new Activity
        {
            ActivityDescription = ActivityDescription.AddSubjectDescription + message.ToString().TrimEnd(' ', ','),
            ActivityType = ActivityType.FreeSubject,
            UserId = userId
        };
        await unitOfWork.ActivityRepository.AddAsync(activity);
        await unitOfWork.SaveChangesAsync();
    }

    public async Task<GetSubjectDto> GetByIdAsync(Guid id)
    {
        var result = await unitOfWork.SubjectRepository.GetByIdAsync(id)
                     ?? throw new EntityNotFoundException($"StudentSubject {id} not found");
        return mapper.Map<GetSubjectDto>(result);
    }

    public async Task UpdateSubjectAsync(UpdateSubjectDto updateSubjectDto)
    {
        var subject = await unitOfWork.SubjectRepository.GetByIdAsync(updateSubjectDto.Id)
                     ?? throw new EntityNotFoundException($"StudentSubject {updateSubjectDto.Id} not found");

        subject.TakeAttendance = updateSubjectDto.TakeAttendance;
        unitOfWork.SubjectRepository.Update(subject);

        var userId = ClaimsHelper.GetUserId(httpContextAccessor);
        var activity = new Activity
        {
            ActivityDescription = ActivityDescription.UpdateSubjectDescription + $" [{subject.SubjectCode}]",
            ActivityType = ActivityType.FreeSubject,
            UserId = userId
        };
        await unitOfWork.ActivityRepository.AddAsync(activity);
        await unitOfWork.SaveChangesAsync();
    }
}
