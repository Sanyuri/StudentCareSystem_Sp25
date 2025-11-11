using StudentCareSystem.Application.Commons.Models.Roles;
using StudentCareSystem.Domain.Entities;

namespace StudentCareSystem.Application.Mappings;
public class RoleProfile : MapProfile
{
    public RoleProfile()
    {
        CreateMap<Role, GetRoleDto>().ReverseMap();
    }
}
