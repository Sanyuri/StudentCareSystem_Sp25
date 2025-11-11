using AutoMapper;

using Microsoft.AspNetCore.Http;

using StudentCareSystem.Application.Commons.Exceptions;
using StudentCareSystem.Application.Commons.Interfaces;
using StudentCareSystem.Application.Commons.Models.ApplicationTypes;
using StudentCareSystem.Domain.Constants;
using StudentCareSystem.Domain.Entities;
using StudentCareSystem.Domain.Enums;
using StudentCareSystem.Domain.Helpers;
using StudentCareSystem.Domain.Interfaces;
using StudentCareSystem.Infrastructure.Specifications;
using StudentCareSystem.Infrastructure.Utilities;


namespace StudentCareSystem.Application.Services;

public class ApplicationTypeService(
    IMapper mapper,
    IHttpContextAccessor httpContextAccessor,
    IUnitOfWork unitOfWork
) : IApplicationTypeService
{
    public async Task<List<ApplicationTypeResponse>> GetApplicationTypes()
    {
        var applicationTypes = await unitOfWork.ApplicationTypeRepository.GetAllAsync();
        return mapper.Map<List<ApplicationTypeResponse>>(applicationTypes);
    }
    public async Task<ApplicationTypeResponse> GetByIdAsync(Guid id)
    {
        var applicationType = await unitOfWork.ApplicationTypeRepository.GetByIdAsync(id);
        return mapper.Map<ApplicationTypeResponse>(applicationType);
    }

    public async Task<ApplicationTypeResponse> AddAsync(ApplicationTypeRequest applicationTypeRequest)
    {
        var applicationTypeEntity = mapper.Map<ApplicationType>(applicationTypeRequest);
        applicationTypeEntity.UpdatedAt = DateTime.UtcNow;
        await unitOfWork.ApplicationTypeRepository.AddAsync(applicationTypeEntity);
        await unitOfWork.SaveChangesAsync();
        //Log activity
        var userId = ClaimsHelper.GetUserId(httpContextAccessor);
        var activity = new Activity
        {
            ActivityDescription = ActivityDescription.AddApplicationTypeDescription + $" [{applicationTypeEntity.VietnameseName}]",
            ActivityType = ActivityType.Application,
            UserId = userId
        };
        await unitOfWork.ActivityRepository.AddAsync(activity);
        await unitOfWork.SaveChangesAsync();
        return mapper.Map<ApplicationTypeResponse>(applicationTypeEntity);
    }

    public async Task UpdateAsync(Guid id, ApplicationTypeRequest applicationTypeRequest)
    {
        var existingApplicationType = await unitOfWork.ApplicationTypeRepository.GetByIdAsync(id)
            ?? throw new EntityNotFoundException(MessageDescription.ExceptionMessageDescription.EntityNotFound("Application Type"));
        existingApplicationType.UpdatedAt = DateTime.UtcNow;
        var applicationTypeEntity = mapper.Map(applicationTypeRequest, existingApplicationType);
        unitOfWork.ApplicationTypeRepository.Update(applicationTypeEntity);
        await unitOfWork.SaveChangesAsync();
        //Log activity
        var userId = ClaimsHelper.GetUserId(httpContextAccessor);
        var activity = new Activity
        {
            ActivityDescription = ActivityDescription.UpdateApplicationTypeDescription + $" [{applicationTypeEntity.VietnameseName}]",
            ActivityType = ActivityType.Application,
            UserId = userId
        };
        await unitOfWork.ActivityRepository.AddAsync(activity);
        await unitOfWork.SaveChangesAsync();
    }

    public async Task DeleteAsync(Guid id)
    {
        //get application type by id
        var applicationTypeEntity = await unitOfWork.ApplicationTypeRepository.GetByIdAsync(id)
            ?? throw new EntityNotFoundException(MessageDescription.ExceptionMessageDescription.EntityNotFound("Application Type"));
        //delete application type
        await unitOfWork.ApplicationTypeRepository.Delete(id);
        await unitOfWork.SaveChangesAsync();
        //Log activity
        var userId = ClaimsHelper.GetUserId(httpContextAccessor);
        var activity = new Activity
        {
            ActivityDescription = ActivityDescription.DeleteApplicationTypeDescription + $" [{applicationTypeEntity.VietnameseName}]",
            ActivityType = ActivityType.Application,
            UserId = userId
        };
        await unitOfWork.ActivityRepository.AddAsync(activity);
        await unitOfWork.SaveChangesAsync();
    }

    public async Task<Pagination<ApplicationTypeResponse>> GetAllWithPaginationAsync(ApplicationTypeFilter filter)
    {
        var specification = new SpecificationBuilder<ApplicationType>()
           .Where(a =>
               string.IsNullOrEmpty(filter.Subject) || a.VietnameseName.Contains(filter.Subject) || a.EnglishName.Contains(filter.Subject)
           )
           .OrderByDescending(a => a.UpdatedAt ?? a.CreatedAt)
           .ApplyPaging(filter.PageNumber, filter.PageSize).Build();
        var emailSamples = await unitOfWork.ApplicationTypeRepository.GetAllWithPaginationAsync(specification);
        return mapper.Map<Pagination<ApplicationTypeResponse>>(emailSamples);
    }
}
