using AutoMapper;

using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

using StudentCareSystem.Application.Commons.Exceptions;
using StudentCareSystem.Application.Commons.Interfaces;
using StudentCareSystem.Application.Commons.Models.Applications;
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
public class StudentApplicationService(
    IMapper mapper,
    IEmailProxyService emailProxyService,
    IHttpContextAccessor httpContextAccessor,
    IUnitOfWork unitOfWork
    ) : IStudentApplicationService
{

    public async Task<Pagination<GetStudentApplicationDto>> GetAllWithPaginationAsync(StudentApplicationFilter filter)
    {
        var specification = new SpecificationBuilder<StudentApplication>()
        .Where(sa =>
            (string.IsNullOrEmpty(filter.SearchTerm) || sa.StudentCode.Contains(filter.SearchTerm)) &&
            (!filter.ApplicationTypeId.HasValue || sa.ApplicationTypeId == filter.ApplicationTypeId) &&
            (!filter.Status.HasValue || sa.Status == filter.Status) &&
            (!filter.DateFrom.HasValue || ((sa.ReturnedDate != DateTime.MinValue ? sa.ReturnedDate : sa.CreatedAt) >= filter.DateFrom)) &&
            (!filter.DateTo.HasValue || ((sa.ReturnedDate != DateTime.MinValue ? sa.ReturnedDate : sa.CreatedAt) <= filter.DateTo)))
            .OrderByDescending(a => a.UpdatedAt ?? a.CreatedAt)
            .ApplyPaging(filter.PageNumber, filter.PageSize)
            .UseSplitQueries()
            .Include(sa => sa.Include(a => a.ApplicationType))
            .Include(sa => sa.Include(a => a.Student))
            .Build();

        var result = await unitOfWork.StudentApplicationRepository.GetAllWithPaginationAsync(specification);
        return mapper.Map<Pagination<GetStudentApplicationDto>>(result);
    }

    public async Task<GetStudentApplicationDto> AddAsync(CreateStudentApplicationDto applicationDto)
    {
        var student = await GetStudentByCodeAsync(applicationDto.StudentCode);
        var applicationType = await unitOfWork.ApplicationTypeRepository.GetByIdAsync(applicationDto.ApplicationTypeId)
            ?? throw new EntityNotFoundException("Application Type not found");
        var entity = mapper.Map<StudentApplication>(applicationDto);
        if (entity.Status == ApplicationStatus.Return)
        {
            entity.ReturnedDate = DateTime.UtcNow;
        }

        var result = await unitOfWork.StudentApplicationRepository.AddAsync(entity);
        await unitOfWork.SaveChangesAsync();
        var dictionary = DictionaryConverter.ConvertToDictionary(student);

        var content = EmailHelper.ReplacePlaceholders(applicationDto.EmailContent, dictionary);
        var semester = await unitOfWork.SemesterRepository.GetCurrentSemesterAsync();

        var emailLog = new EmailLog
        {
            EmailType = EmailType.ApplicationNotification,
            EntityId = result.Id,
            SemesterName = semester?.SemesterName ?? "Unknown",
            StudentCode = student.StudentCode,
        };
        //Log activity
        var userId = ClaimsHelper.GetUserId(httpContextAccessor);
        var activity = new Activity
        {
            ActivityDescription = ActivityDescription.AddStudentApplicationDescription
                .Replace("{ApplicationType}", $"[{applicationType.VietnameseName}]")
                .Replace("{StudentCode}", $"[{student.StudentCode}]"),
            ActivityType = ActivityType.Application,
            UserId = userId
        };
        await unitOfWork.ActivityRepository.AddAsync(activity);
        await unitOfWork.SaveChangesAsync();

        await emailProxyService.SendEmailAsync(applicationDto.EmailSubject,
            content, [student.Email],
            applicationDto.CcEmails,
            applicationDto.BccEmails, applicationDto.ReplyToEmail,
            emailLog
            );
        await unitOfWork.EmailLogRepository.AddAsync(emailLog);
        await unitOfWork.SaveChangesAsync();

        return mapper.Map<GetStudentApplicationDto>(result);
    }

    public async Task DeleteAsync(Guid id)
    {
        var applicationToDelete = await unitOfWork.StudentApplicationRepository.GetByIdAsync(id)
            ?? throw new EntityNotFoundException(MessageDescription.ExceptionMessageDescription.EntityNotFound("Student Application"));
        await unitOfWork.StudentApplicationRepository.Delete(id);
        await unitOfWork.SaveChangesAsync();
        //Log activity
        var userId = ClaimsHelper.GetUserId(httpContextAccessor);
        var activity = new Activity
        {
            ActivityDescription = ActivityDescription.DeleteStudentApplicationDescription
                .Replace("{ApplicationType}", $"[{applicationToDelete.ApplicationType?.VietnameseName}]")
                .Replace("{StudentCode}", $"[{applicationToDelete.Student?.StudentCode}]"),
            ActivityType = ActivityType.Application,
            UserId = userId
        };
        await unitOfWork.ActivityRepository.AddAsync(activity);
        await unitOfWork.SaveChangesAsync();
    }

    public async Task<GetStudentApplicationDto?> GetByIdAsync(Guid id)
    {
        var specification = new SpecificationBuilder<StudentApplication>()
            .Include(a => a.Include(s => s.Student).Include(a => a.ApplicationType))
            .Where(a => a.Id == id)
            .Build();
        var application = await unitOfWork.StudentApplicationRepository.FirstOrDefaultAsync(specification)
            ?? throw new EntityNotFoundException(MessageDescription.ExceptionMessageDescription.EntityNotFound("Student Application"));
        return mapper.Map<GetStudentApplicationDto>(application);
    }

    private async Task<Student> GetStudentByCodeAsync(string studentCode)
    {
        return await unitOfWork.StudentRepository.GetByStudentCodeAsync(studentCode)
            ?? throw new EntityNotFoundException(MessageDescription.ExceptionMessageDescription.EntityNotFound("Student"));
    }
}
