using StudentCareSystem.Application.Commons.Models.Permissions;
using StudentCareSystem.Domain.Entities;

namespace StudentCareSystem.Application.Mappings;
public class PermissionProfile : MapProfile
{
    public PermissionProfile()
    {
        CreateMap<Permission, GetPermissionDto>().ReverseMap();
    }
}
