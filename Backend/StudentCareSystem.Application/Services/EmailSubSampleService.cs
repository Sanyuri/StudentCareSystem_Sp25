using AutoMapper;

using Microsoft.AspNetCore.Http;

using StudentCareSystem.Application.Commons.Exceptions;
using StudentCareSystem.Application.Commons.Interfaces;
using StudentCareSystem.Application.Commons.Models.EmailSubSamples;
using StudentCareSystem.Domain.Constants;
using StudentCareSystem.Domain.Entities;
using StudentCareSystem.Domain.Enums;
using StudentCareSystem.Domain.Helpers;
using StudentCareSystem.Domain.Interfaces;
using StudentCareSystem.Infrastructure.Specifications;
using StudentCareSystem.Infrastructure.Utilities;

namespace StudentCareSystem.Application.Services;

public class EmailSubSampleService(
    IMapper mapper,
    IHttpContextAccessor httpContextAccessor,
    IUnitOfWork unitOfWork
) : IEmailSubSampleService
{
    private const string EmailSubSample = "Email SubSample";

    public async Task<Pagination<GetEmailSubSampleDto>> GetAllWithPaginationAsync(EmailSubSampleFilter filter)
    {
        var specification = new SpecificationBuilder<EmailSubSample>()
            .Where(a =>
                !filter.EmailType.HasValue || a.EmailType == filter.EmailType.Value
            )
            .OrderByDescending(a => a.UpdatedAt ?? a.CreatedAt)
            .ApplyPaging(filter.PageNumber, filter.PageSize).Build();
        var emailSubSamples = await unitOfWork.EmailSubSampleRepository.GetAllWithPaginationAsync(specification);
        return mapper.Map<Pagination<GetEmailSubSampleDto>>(emailSubSamples);
    }

    public async Task<GetEmailSubSampleDto> GetByIdAsync(Guid guid)
    {
        var emailSubSample = await unitOfWork.EmailSubSampleRepository.GetByIdAsync(guid)
                          ?? throw new EntityNotFoundException(
                              MessageDescription.ExceptionMessageDescription.EntityNotFound(EmailSubSample));
        return mapper.Map<GetEmailSubSampleDto>(emailSubSample);
    }

    public async Task<GetEmailSubSampleDto> AddAsync(CreateEmailSubSampleDto emailSubSample)
    {
        var emailSubSampleEntity = mapper.Map<EmailSubSample>(emailSubSample);
        emailSubSampleEntity = await unitOfWork.EmailSubSampleRepository.AddAsync(emailSubSampleEntity);
        await ValidEmailSubSampleName(emailSubSampleEntity);
        await unitOfWork.SaveChangesAsync();
        // Log activity
        var userId = ClaimsHelper.GetUserId(httpContextAccessor);
        var activity = new Activity
        {
            UserId = userId,
            ActivityType = ActivityType.EmailSubSample,
            ActivityDescription = ActivityDescription.CreateEmailSubSampleDescription + $" [{emailSubSample.Name}]",
        };
        await unitOfWork.ActivityRepository.AddAsync(activity);
        await unitOfWork.SaveChangesAsync();
        return mapper.Map<GetEmailSubSampleDto>(emailSubSampleEntity);
    }

    public async Task UpdateAsync(UpdateEmailSubSampleDto emailSubSample)
    {
        var existingEmailSubSample = await unitOfWork.EmailSubSampleRepository.GetByIdAsync(emailSubSample.Id) ??
                                  throw new EntityNotFoundException(
                                      MessageDescription.ExceptionMessageDescription.EntityNotFound(EmailSubSample));
        await ValidEmailSubSampleName(existingEmailSubSample);
        existingEmailSubSample.Content = emailSubSample.Content;
        existingEmailSubSample.EnglishDescription = emailSubSample.EnglishDescription;
        existingEmailSubSample.VietnameseDescription = emailSubSample.VietnameseDescription;
        unitOfWork.EmailSubSampleRepository.Update(existingEmailSubSample);
        await unitOfWork.SaveChangesAsync();
        // Log activity
        var userId = ClaimsHelper.GetUserId(httpContextAccessor);
        var activity = new Activity
        {
            UserId = userId,
            ActivityType = ActivityType.EmailSubSample,
            ActivityDescription = ActivityDescription.UpdateEmailSubSampleDescription + $" [{emailSubSample.Name}]",
        };
        await unitOfWork.ActivityRepository.AddAsync(activity);
        await unitOfWork.SaveChangesAsync();
    }

    public async Task DeleteAsync(Guid guid)
    {
        var emailSubSample = await unitOfWork.EmailSubSampleRepository.GetByIdAsync(guid)
            ?? throw new EntityNotFoundException(
                MessageDescription.ExceptionMessageDescription.EntityNotFound(EmailSubSample));
        // Check if emailSubSample is used in EmailSample
        var specification = new SpecificationBuilder<EmailSample>()
            .Where(a => a.EmailSubSampleList.Contains(emailSubSample.Name))
            .Build();
        if (await unitOfWork.EmailSampleRepository.AnyAsync(specification))
        {
            throw new InvalidOperationException(
                MessageDescription.ExceptionMessageDescription.EntityInUsed(EmailSubSample));
        }
        unitOfWork.EmailSubSampleRepository.Delete(emailSubSample);
        await unitOfWork.SaveChangesAsync();
        // Log activity
        var userId = ClaimsHelper.GetUserId(httpContextAccessor);
        var activity = new Activity
        {
            UserId = userId,
            ActivityType = ActivityType.EmailSubSample,
            ActivityDescription = ActivityDescription.DeleteEmailSubSampleDescription + $" [{emailSubSample.EnglishDescription}]",
        };
        await unitOfWork.ActivityRepository.AddAsync(activity);
        await unitOfWork.SaveChangesAsync();
    }

    public async Task ValidEmailSubSampleName(EmailSubSample emailSubSample)
    {
        var emailSubSampleName = await unitOfWork.EmailSubSampleRepository.GetByNamesAsync(emailSubSample.Name);
        if (emailSubSampleName != null && emailSubSampleName.Id != emailSubSample.Id)
        {
            throw new EntityAlreadyExistsException(
                MessageDescription.ExceptionMessageDescription.EntityAlreadyExists(EmailSubSample));
        }
    }
}
