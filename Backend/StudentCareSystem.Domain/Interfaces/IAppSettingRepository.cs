using StudentCareSystem.Domain.Entities;

namespace StudentCareSystem.Domain.Interfaces;

public interface IAppSettingRepository : IBaseRepository<AppSetting>
{
    Task<AppSetting?> GetByKeyAsync(string key);
}
