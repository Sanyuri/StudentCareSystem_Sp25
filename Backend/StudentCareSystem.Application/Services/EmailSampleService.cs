using AutoMapper;

using Microsoft.AspNetCore.Http;

using StudentCareSystem.Application.Commons.Exceptions;
using StudentCareSystem.Application.Commons.Interfaces;
using StudentCareSystem.Application.Commons.Models.EmailSamples;
using StudentCareSystem.Application.Commons.Utilities;
using StudentCareSystem.Domain.Constants;
using StudentCareSystem.Domain.Entities;
using StudentCareSystem.Domain.Enums;
using StudentCareSystem.Domain.Helpers;
using StudentCareSystem.Domain.Interfaces;
using StudentCareSystem.Infrastructure.Specifications;
using StudentCareSystem.Infrastructure.Utilities;

namespace StudentCareSystem.Application.Services;

public class EmailSampleService(
    IMapper mapper,
    IHttpContextAccessor httpContextAccessor,
    IUnitOfWork unitOfWork
) : IEmailSampleService
{
    private const string EmailSample = "Email Sample";

    public async Task<Pagination<GetEmailSampleDto>> GetAllWithPaginationAsync(EmailSampleFilter filter)
    {
        var specification = new SpecificationBuilder<EmailSample>()
            .Where(a =>
                (string.IsNullOrEmpty(filter.Subject) || a.Subject.Contains(filter.Subject)) &&
                (!filter.EmailType.HasValue || a.EmailType == filter.EmailType.Value)
            )
            .OrderByDescending(a => a.UpdatedAt ?? a.CreatedAt)
            .ApplyPaging(filter.PageNumber, filter.PageSize).Build();
        var emailSamples = await unitOfWork.EmailSampleRepository.GetAllWithPaginationAsync(specification);
        return mapper.Map<Pagination<GetEmailSampleDto>>(emailSamples);
    }

    public async Task<GetEmailSampleDto> GetByIdAsync(Guid guid)
    {
        var emailSample = await unitOfWork.EmailSampleRepository.GetByIdAsync(guid)
                          ?? throw new EntityNotFoundException(
                              MessageDescription.ExceptionMessageDescription.EntityNotFound(EmailSample));
        return mapper.Map<GetEmailSampleDto>(emailSample);
    }

    public async Task<GetEmailSampleDto> AddAsync(CreateEmailSampleDto emailSample)
    {
        var emailSampleEntity = mapper.Map<EmailSample>(emailSample);
        await ValidEmailSubSampleList(emailSampleEntity);
        emailSampleEntity = await unitOfWork.EmailSampleRepository.AddAsync(emailSampleEntity);
        await unitOfWork.SaveChangesAsync();
        // Log activity
        var userId = ClaimsHelper.GetUserId(httpContextAccessor);
        var activity = new Activity
        {
            UserId = userId,
            ActivityType = ActivityType.EmailSample,
            ActivityDescription = ActivityDescription.CreateEmailSampleDescription + $" [{emailSample.Subject}]",
        };
        await unitOfWork.ActivityRepository.AddAsync(activity);
        await unitOfWork.SaveChangesAsync();
        return mapper.Map<GetEmailSampleDto>(emailSampleEntity);
    }

    public async Task UpdateAsync(UpdateEmailSampleDto emailSample)
    {
        var existingEmailSample = await unitOfWork.EmailSampleRepository.GetByIdAsync(emailSample.Id) ??
                                  throw new EntityNotFoundException(
                                      MessageDescription.ExceptionMessageDescription.EntityNotFound(EmailSample));
        if (existingEmailSample.IsSystemEmail)
        {
            throw new InvalidOperationException(
                MessageDescription.ExceptionMessageDescription.EntityInUsed(EmailSample));
        }
        var updateEmailSample = mapper.Map<EmailSample>(emailSample);
        existingEmailSample.Subject = updateEmailSample.Subject;
        existingEmailSample.Content = updateEmailSample.Content;
        existingEmailSample.CcEmails = updateEmailSample.CcEmails;
        existingEmailSample.BccEmails = updateEmailSample.BccEmails;
        existingEmailSample.ReplyToEmail = updateEmailSample.ReplyToEmail;
        await ValidEmailSubSampleList(existingEmailSample);
        unitOfWork.EmailSampleRepository.Update(existingEmailSample);
        await unitOfWork.SaveChangesAsync();
        // Log activity
        var userId = ClaimsHelper.GetUserId(httpContextAccessor);
        var activity = new Activity
        {
            UserId = userId,
            ActivityType = ActivityType.EmailSample,
            ActivityDescription = ActivityDescription.UpdateEmailSampleDescription + $" [{emailSample.Subject}]",
        };
        await unitOfWork.ActivityRepository.AddAsync(activity);
        await unitOfWork.SaveChangesAsync();
    }

    public async Task DeleteAsync(Guid guid)
    {
        var specification = new SpecificationBuilder<AbsenceRateBoundary>()
            .Where(a => a.EmailSampleId == guid)
            .Build();

        if (await unitOfWork.AbsenceRateBoundaryRepository.AnyAsync(specification))
        {
            throw new InvalidOperationException(
                MessageDescription.ExceptionMessageDescription.EntityInUsed(EmailSample));
        }

        var emailSample = await unitOfWork.EmailSampleRepository.GetByIdAsync(guid)
            ?? throw new EntityNotFoundException(
                MessageDescription.ExceptionMessageDescription.EntityNotFound(EmailSample));
        if (emailSample.IsSystemEmail)
        {
            throw new InvalidOperationException(
                MessageDescription.ExceptionMessageDescription.EntityInUsed(EmailSample));
        }
        await unitOfWork.EmailSampleRepository.Delete(guid);
        await unitOfWork.SaveChangesAsync();
        // Log activity
        var userId = ClaimsHelper.GetUserId(httpContextAccessor);
        var activity = new Activity
        {
            UserId = userId,
            ActivityType = ActivityType.EmailSample,
            ActivityDescription = ActivityDescription.DeleteEmailSampleDescription + $" [{emailSample.Subject}]",
        };
        await unitOfWork.ActivityRepository.AddAsync(activity);
        await unitOfWork.SaveChangesAsync();
    }

    private async Task ValidEmailSubSampleList(EmailSample emailSample)
    {
        var subEmailSamples = EmailHelper.GetAllSubTemplateNames(emailSample.Content);
        if (subEmailSamples.Count != 0)
        {
            emailSample.EmailSubSampleList = StringListConverter.ConvertListToString(subEmailSamples);
            var emailSubSampleSpecification = new SpecificationBuilder<EmailSubSample>()
                .Where(a => subEmailSamples.Contains(a.Name))
                .Build();
            var emailSubSamples = await unitOfWork.EmailSubSampleRepository.GetAllAsync(emailSubSampleSpecification);
            if (emailSubSamples.Count() != subEmailSamples.Count)
            {
                throw new EntityNotFoundException(
                    MessageDescription.ExceptionMessageDescription.EntityNotFound("Email Sub Sample"));
            }
        }
    }
}
