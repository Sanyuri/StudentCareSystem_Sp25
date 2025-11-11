using AutoMapper;

using Microsoft.AspNetCore.Http;

using StudentCareSystem.Application.Commons.Exceptions;
using StudentCareSystem.Application.Commons.Interfaces;
using StudentCareSystem.Application.Commons.Models.PsychologyNoteTypes;
using StudentCareSystem.Domain.Constants;
using StudentCareSystem.Domain.Entities;
using StudentCareSystem.Domain.Enums;
using StudentCareSystem.Domain.Interfaces;
using StudentCareSystem.Infrastructure.Utilities;

namespace StudentCareSystem.Application.Services;

public class PsychologyNoteTypeService(
    IMapper mapper,
    IHttpContextAccessor httpContextAccessor,
    IUnitOfWork unitOfWork
) : IPsychologyNoteTypeService
{

    public async Task<IEnumerable<GetPsychologyNoteTypeDto>> GetAllAsync()
    {
        var result = await unitOfWork.PsychologyNoteTypeRepository.GetAllAsync();
        return mapper.Map<IEnumerable<GetPsychologyNoteTypeDto>>(result);
    }

    public async Task<GetPsychologyNoteTypeDto> AddAsync(CreatePsychologyNoteTypeDto createPsychologyNoteTypeDto)
    {
        var noteType = mapper.Map<PsychologyNoteType>(createPsychologyNoteTypeDto);
        var result = await unitOfWork.PsychologyNoteTypeRepository.AddAsync(noteType);
        await unitOfWork.SaveChangesAsync();
        //Log activity
        var userId = ClaimsHelper.GetUserId(httpContextAccessor);
        var activity = new Activity
        {
            ActivityDescription = ActivityDescription.AddPsychologyNoteTypeDescription + $" [{noteType.VietnameseName}]",
            ActivityType = ActivityType.Note,
            UserId = userId
        };
        await unitOfWork.ActivityRepository.AddAsync(activity);
        await unitOfWork.SaveChangesAsync();
        return mapper.Map<GetPsychologyNoteTypeDto>(result);
    }

    public async Task<GetPsychologyNoteTypeDto> GetByIdAsync(Guid id)
    {
        var result = await unitOfWork.PsychologyNoteTypeRepository.GetByIdAsync(id);
        return mapper.Map<GetPsychologyNoteTypeDto>(result);
    }

    public async Task UpdateAsync(UpdatePsychologyNoteTypeDto updatePsychologyNoteTypeDto)
    {
        var noteType = await GetPsychologyNoteTypeById(updatePsychologyNoteTypeDto.Id);
        noteType.EnglishName = updatePsychologyNoteTypeDto.EnglishName;
        noteType.VietnameseName = updatePsychologyNoteTypeDto.VietnameseName;
        unitOfWork.PsychologyNoteTypeRepository.Update(noteType);
        await unitOfWork.SaveChangesAsync();
        //Log activity
        var userId = ClaimsHelper.GetUserId(httpContextAccessor);
        var activity = new Activity
        {
            ActivityDescription = ActivityDescription.UpdatePsychologyNoteTypeDescription + $" [{noteType.VietnameseName}]",
            ActivityType = ActivityType.Note,
            UserId = userId
        };
        await unitOfWork.ActivityRepository.AddAsync(activity);
        await unitOfWork.SaveChangesAsync();
    }

    public async Task DeleteAsync(Guid id)
    {
        var noteType = await GetPsychologyNoteTypeById(id);
        unitOfWork.PsychologyNoteTypeRepository.Delete(noteType);
        await unitOfWork.SaveChangesAsync();
        //Log activity
        var userId = ClaimsHelper.GetUserId(httpContextAccessor);
        var activity = new Activity
        {
            ActivityDescription = ActivityDescription.DeletePsychologyNoteTypeDescription + $" [{noteType.VietnameseName}]",
            ActivityType = ActivityType.Note,
            UserId = userId
        };
        await unitOfWork.ActivityRepository.AddAsync(activity);
        await unitOfWork.SaveChangesAsync();
    }

    private async Task<PsychologyNoteType> GetPsychologyNoteTypeById(Guid guid)
    {
        return await unitOfWork.PsychologyNoteTypeRepository.GetByIdAsync(guid) ??
                throw new EntityNotFoundException($"PsychologyNoteType with id {guid} not found.");
    }
}
