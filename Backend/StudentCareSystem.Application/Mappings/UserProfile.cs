using StudentCareSystem.Application.Commons.Models.Users;
using StudentCareSystem.Domain.Entities;

namespace StudentCareSystem.Application.Mappings;

public class UserProfile : MapProfile
{
    public UserProfile()
    {
        CreateMap<User, GetUserDto>()
            .ForMember(dest => dest.PermissionIds, opt => opt.MapFrom(src => src.UserPermissions.Select(x => x.PermissionId)));

        CreateMap<CreateUserDto, User>()
            .ForMember(dest => dest.UserPermissions, opt => opt.MapFrom(src => src.PermissionIds.Select(x => new UserPermission { PermissionId = x })));

        CreateMap<User, OfficerDto>()
           .ForMember(dest => dest.TotalPermissions, opt => opt.MapFrom(src => src.UserPermissions.Count))
           .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status));

        CreateMap<User, GetUserDetailDto>()
            .ForMember(dest => dest.Permissions, opt => opt.MapFrom(src => src.UserPermissions.Select(x => x.Permission)));
    }
}
