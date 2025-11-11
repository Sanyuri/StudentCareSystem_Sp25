using AutoMapper;

using StudentCareSystem.Application.Commons.Models.AppSettings;
using StudentCareSystem.Domain.Entities;

namespace StudentCareSystem.Application.Mappings;

public class AppSettingProfile : Profile
{
    public AppSettingProfile()
    {
        CreateMap<AppSetting, GetAppSettingDto>();
        CreateMap<CreateAppSettingDto, AppSetting>();
        CreateMap<UpdateAppSettingDto, AppSetting>();
    }
}
