using AutoMapper;

using StudentCareSystem.Application.Commons.Exceptions;
using StudentCareSystem.Application.Commons.Interfaces;
using StudentCareSystem.Application.Commons.Models.AppSettings;
using StudentCareSystem.Domain.Constants;
using StudentCareSystem.Domain.Entities;
using StudentCareSystem.Domain.Interfaces;

namespace StudentCareSystem.Application.Services;

public class AppSettingService(
    IMapper mapper,
    IUnitOfWork unitOfWork
) : IAppSettingService
{

    public async Task<IEnumerable<GetAppSettingDto>> GetAllAsync()
    {
        var result = await unitOfWork.AppSettingRepository.GetAllAsync();
        return mapper.Map<IEnumerable<GetAppSettingDto>>(result);
    }

    public async Task<GetAppSettingDto> AddAsync(CreateAppSettingDto appSetting)
    {
        var newEntity = mapper.Map<AppSetting>(appSetting);
        await CheckKeyExisted(newEntity);
        var result = await unitOfWork.AppSettingRepository.AddAsync(newEntity);
        await unitOfWork.SaveChangesAsync();
        return mapper.Map<GetAppSettingDto>(result);
    }

    public async Task<GetAppSettingDto> GetByIdAsync(Guid id)
    {
        var result = await unitOfWork.AppSettingRepository.GetByIdAsync(id)
            ?? throw new EntityNotFoundException(MessageDescription.ExceptionMessageDescription.EntityNotFound("App setting"));
        return mapper.Map<GetAppSettingDto>(result);
    }

    public async Task<GetAppSettingDto> GetByKeyAsync(string key)
    {
        var result = await unitOfWork.AppSettingRepository.GetByKeyAsync(key)
            ?? throw new EntityNotFoundException(MessageDescription.ExceptionMessageDescription.EntityNotFound("App setting"));
        return mapper.Map<GetAppSettingDto>(result);
    }

    public async Task UpdateAsync(UpdateAppSettingDto appSetting)
    {
        var currentEntity = await unitOfWork.AppSettingRepository.GetByIdAsync(appSetting.Id)
            ?? throw new EntityNotFoundException(MessageDescription.ExceptionMessageDescription.EntityNotFound("App setting"));
        var updatedEntity = mapper.Map<AppSetting>(appSetting);
        await CheckKeyExisted(updatedEntity);
        currentEntity.Key = updatedEntity.Key;
        currentEntity.Value = updatedEntity.Value;
        unitOfWork.AppSettingRepository.Update(currentEntity);
        await unitOfWork.SaveChangesAsync();
    }

    public async Task DeleteAsync(Guid id)
    {
        var deletedEntity = await unitOfWork.AppSettingRepository.GetByIdAsync(id)
            ?? throw new EntityNotFoundException(MessageDescription.ExceptionMessageDescription.EntityNotFound("App setting"));
        unitOfWork.AppSettingRepository.Delete(deletedEntity);
        await unitOfWork.SaveChangesAsync();
    }

    // Check if the key is existed
    private async Task CheckKeyExisted(AppSetting appSetting)
    {
        var key = await unitOfWork.AppSettingRepository.GetByKeyAsync(appSetting.Key);
        if (key != null && key.Id != appSetting.Id)
        {
            throw new EntityAlreadyExistsException(MessageDescription.ExceptionMessageDescription.EntityAlreadyExists("App setting"));
        }
    }
}
