using AutoMapper;

using Microsoft.AspNetCore.Http;

using StudentCareSystem.Application.Commons.Exceptions;
using StudentCareSystem.Application.Commons.Interfaces;
using StudentCareSystem.Application.Commons.Models.NoteTypes;
using StudentCareSystem.Domain.Constants;
using StudentCareSystem.Domain.Entities;
using StudentCareSystem.Domain.Enums;
using StudentCareSystem.Domain.Interfaces;
using StudentCareSystem.Infrastructure.Specifications;
using StudentCareSystem.Infrastructure.Utilities;

namespace StudentCareSystem.Application.Services;
public class NoteTypeService(
    IMapper mapper,
    IHttpContextAccessor httpContextAccessor,
    IUnitOfWork unitOfWork
) : INoteTypeService
{
    public async Task<IEnumerable<GetNoteTypeDto>> GetAllAsync()
    {
        var result = await unitOfWork.NoteTypeRepository.GetAllAsync();
        return mapper.Map<IEnumerable<GetNoteTypeDto>>(result);
    }

    public async Task<GetNoteTypeDto> GetByDefaultTypeAsync(DefaultNoteType defaultNoteType)
    {
        var specification = new SpecificationBuilder<NoteType>()
            .Where(x => x.DefaultNoteType == defaultNoteType)
            .Build();
        var result = await unitOfWork.NoteTypeRepository.FirstOrDefaultAsync(specification);
        if (result == null)
        {
            // Add default note type
            var noteType = new NoteType
            {
                DefaultNoteType = defaultNoteType,
                EnglishName = defaultNoteType.ToString(),
                VietnameseName = defaultNoteType.ToString()
            };
            result = await unitOfWork.NoteTypeRepository.AddAsync(noteType);
            await unitOfWork.SaveChangesAsync();
        }
        return mapper.Map<GetNoteTypeDto>(result);
    }

    public async Task<GetNoteTypeDto> GetByIdAsync(Guid id)
    {
        var result = await unitOfWork.NoteTypeRepository.GetByIdAsync(id)
                ?? throw new EntityNotFoundException(MessageDescription.ExceptionMessageDescription.EntityNotFound("Note type"));
        return mapper.Map<GetNoteTypeDto>(result);
    }

    public async Task<GetNoteTypeDto> AddAsync(CreateNoteTypeDto noteType)
    {
        var noteTypeEntity = mapper.Map<NoteType>(noteType);
        noteTypeEntity.DefaultNoteType = DefaultNoteType.Unknown;
        var result = await unitOfWork.NoteTypeRepository.AddAsync(noteTypeEntity);
        await unitOfWork.SaveChangesAsync();
        // Log activity
        var userId = ClaimsHelper.GetUserId(httpContextAccessor);
        var activity = new Activity
        {
            ActivityDescription = ActivityDescription.AddNoteTypeDescription + $" [{noteTypeEntity.VietnameseName}]",
            ActivityType = ActivityType.Note,
            UserId = userId
        };
        await unitOfWork.ActivityRepository.AddAsync(activity);
        await unitOfWork.SaveChangesAsync();
        return mapper.Map<GetNoteTypeDto>(result);
    }

    public async Task DeleteAsync(Guid id)
    {
        var deletedEntity = await unitOfWork.NoteTypeRepository.GetByIdAsync(id);
        if (deletedEntity == null)
        {
            throw new EntityNotFoundException(MessageDescription.ExceptionMessageDescription.EntityNotFound("Note type"));
        }
        else if (deletedEntity.DefaultNoteType != DefaultNoteType.Unknown)
        {
            throw new InvalidOperationException("Cannot delete default note type");
        }
        await unitOfWork.NoteTypeRepository.Delete(id);
        await unitOfWork.SaveChangesAsync();
        // Log activity
        var userId = ClaimsHelper.GetUserId(httpContextAccessor);
        var activity = new Activity
        {
            ActivityDescription = ActivityDescription.DeleteNoteTypeDescription + $" [{deletedEntity.VietnameseName}]",
            ActivityType = ActivityType.Note,
            UserId = userId
        };
        await unitOfWork.ActivityRepository.AddAsync(activity);
        await unitOfWork.SaveChangesAsync();
    }

    public async Task UpdateAsync(UpdateNoteTypeDto noteType)
    {
        var currentEntity = await unitOfWork.NoteTypeRepository.GetByIdAsync(noteType.Id)
                ?? throw new EntityNotFoundException(MessageDescription.ExceptionMessageDescription.EntityNotFound("Note type"));
        if (noteType.EnglishName != currentEntity.EnglishName
            || noteType.VietnameseName != currentEntity.VietnameseName)
        {
            currentEntity.EnglishName = noteType.EnglishName;
            currentEntity.VietnameseName = noteType.VietnameseName;
            unitOfWork.NoteTypeRepository.Update(currentEntity);
            await unitOfWork.SaveChangesAsync();
        }
        // Log activity
        var userId = ClaimsHelper.GetUserId(httpContextAccessor);
        var activity = new Activity
        {
            ActivityDescription = ActivityDescription.UpdateNoteTypeDescription + $" [{currentEntity.VietnameseName}]",
            ActivityType = ActivityType.Note,
            UserId = userId
        };
        await unitOfWork.ActivityRepository.AddAsync(activity);
        await unitOfWork.SaveChangesAsync();
    }
}
