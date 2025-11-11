using StudentCareSystem.Application.Commons.Models.Users;
using StudentCareSystem.Domain.Entities;
using StudentCareSystem.Domain.Helpers;

namespace StudentCareSystem.Application.Commons.Interfaces;

public interface IUserService
{
    Task SaveRefreshTokenAsync(User user, RefreshToken refreshToken);
    Task<User?> GetUserByEmailAsync();
    Task DeleteRefreshToken(RefreshToken userRefreshToken);
    Task<IEnumerable<GetUserDto>> GetAllAsync();
    Task<Pagination<OfficerDto>> GetAllWithPaginationAsync(UserFilter filter);
    Task<GetUserDto> AddUserAsync(CreateUserDto userDto);
    Task<GetUserDetailDto> GetDetailAsync(Guid id);
    Task UpdateUserAsync(UpdateUserDto userDto);
    Task DeleteUserAsync(Guid userId);
}
