using AutoMapper;

using Microsoft.AspNetCore.Http;

using StudentCareSystem.Application.Commons.Exceptions;
using StudentCareSystem.Application.Commons.Interfaces;
using StudentCareSystem.Application.Commons.Models.ProgressCriterionTypes;
using StudentCareSystem.Domain.Constants;
using StudentCareSystem.Domain.Entities;
using StudentCareSystem.Domain.Enums;
using StudentCareSystem.Domain.Interfaces;
using StudentCareSystem.Infrastructure.Utilities;

namespace StudentCareSystem.Application.Services;

public class ProgressCriterionTypeService(
    IMapper mapper,
    IHttpContextAccessor httpContextAccessor,
    IUnitOfWork unitOfWork
) : IProgressCriterionTypeService
{

    public async Task<IEnumerable<GetProgressCriterionTypeDto>> GetAllAsync()
    {
        var result = await unitOfWork.ProgressCriterionTypeRepository.GetAllAsync();
        return mapper.Map<IEnumerable<GetProgressCriterionTypeDto>>(result);
    }

    public async Task<GetProgressCriterionTypeDto> AddAsync(CreateProgressCriterionTypeDto createProgressCriterionTypeDto)
    {
        var noteType = mapper.Map<ProgressCriterionType>(createProgressCriterionTypeDto);
        var result = await unitOfWork.ProgressCriterionTypeRepository.AddAsync(noteType);
        await unitOfWork.SaveChangesAsync();
        //Log activity
        var userId = ClaimsHelper.GetUserId(httpContextAccessor);
        var activity = new Activity
        {
            ActivityDescription = ActivityDescription.AddProgressCriterionTypeDescription + $" [{noteType.VietnameseName}]",
            ActivityType = ActivityType.Note,
            UserId = userId
        };
        await unitOfWork.ActivityRepository.AddAsync(activity);
        await unitOfWork.SaveChangesAsync();
        return mapper.Map<GetProgressCriterionTypeDto>(result);
    }

    public async Task<GetProgressCriterionTypeDto> GetByIdAsync(Guid id)
    {
        var result = await unitOfWork.ProgressCriterionTypeRepository.GetByIdAsync(id);
        return mapper.Map<GetProgressCriterionTypeDto>(result);
    }

    public async Task UpdateAsync(UpdateProgressCriterionTypeDto updateProgressCriterionTypeDto)
    {
        var noteType = await GetProgressCriterionTypeById(updateProgressCriterionTypeDto.Id);
        noteType.EnglishName = updateProgressCriterionTypeDto.EnglishName;
        noteType.VietnameseName = updateProgressCriterionTypeDto.VietnameseName;
        noteType.EnglishDescription = updateProgressCriterionTypeDto.EnglishDescription;
        noteType.VietnameseDescription = updateProgressCriterionTypeDto.VietnameseDescription;
        unitOfWork.ProgressCriterionTypeRepository.Update(noteType);
        await unitOfWork.SaveChangesAsync();
        //Log activity
        var userId = ClaimsHelper.GetUserId(httpContextAccessor);
        var activity = new Activity
        {
            ActivityDescription = ActivityDescription.UpdateProgressCriterionTypeDescription + $" [{noteType.VietnameseName}]",
            ActivityType = ActivityType.Note,
            UserId = userId
        };
        await unitOfWork.ActivityRepository.AddAsync(activity);
        await unitOfWork.SaveChangesAsync();
    }

    public async Task DeleteAsync(Guid id)
    {
        var noteType = await GetProgressCriterionTypeById(id);
        unitOfWork.ProgressCriterionTypeRepository.Delete(noteType);
        await unitOfWork.SaveChangesAsync();
        //Log activity
        var userId = ClaimsHelper.GetUserId(httpContextAccessor);
        var activity = new Activity
        {
            ActivityDescription = ActivityDescription.DeleteProgressCriterionTypeDescription + $" [{noteType.VietnameseName}]",
            ActivityType = ActivityType.Note,
            UserId = userId
        };
        await unitOfWork.ActivityRepository.AddAsync(activity);
        await unitOfWork.SaveChangesAsync();
    }

    private async Task<ProgressCriterionType> GetProgressCriterionTypeById(Guid guid)
    {
        return await unitOfWork.ProgressCriterionTypeRepository.GetByIdAsync(guid) ??
            throw new EntityNotFoundException($"ProgressCriterionType with id {guid} not found.");
    }
}
