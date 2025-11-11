using StudentCareSystem.Domain.Entities;
using StudentCareSystem.Domain.Enums;

namespace StudentCareSystem.Domain.Interfaces;

public interface IUserRepository : IBaseRepository<User>
{
    Task<User?> GetByEmailAsync(string dataEmail);
    Task<User?> GetByIdWithRoleAsync(Guid id);
    Task<User?> GetUserByRefreshToken(string refreshToken);
    Task<IEnumerable<User>> GetAllWithIncludeAsync();
    Task<IEnumerable<string>> GetAllEmailByRoleAsync(RoleType roleType);
    Task<IEnumerable<string>> GetAllFEEmailInRoleAsync(IEnumerable<RoleType> roleTypes);
}
