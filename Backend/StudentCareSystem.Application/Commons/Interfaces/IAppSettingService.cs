using StudentCareSystem.Application.Commons.Models.AppSettings;

namespace StudentCareSystem.Application.Commons.Interfaces;

public interface IAppSettingService
{
    Task<IEnumerable<GetAppSettingDto>> GetAllAsync();
    Task<GetAppSettingDto> GetByIdAsync(Guid id);
    Task<GetAppSettingDto> GetByKeyAsync(string key);
    Task<GetAppSettingDto> AddAsync(CreateAppSettingDto appSetting);
    Task UpdateAsync(UpdateAppSettingDto appSetting);
    Task DeleteAsync(Guid id);
}
