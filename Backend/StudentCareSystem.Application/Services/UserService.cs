using AutoMapper;

using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

using StudentCareSystem.Application.Commons.Exceptions;
using StudentCareSystem.Application.Commons.Interfaces;
using StudentCareSystem.Application.Commons.Models.Users;
using StudentCareSystem.Domain.Constants;
using StudentCareSystem.Domain.Entities;
using StudentCareSystem.Domain.Enums;
using StudentCareSystem.Domain.Helpers;
using StudentCareSystem.Domain.Interfaces;
using StudentCareSystem.Infrastructure.Specifications;
using StudentCareSystem.Infrastructure.Utilities;

namespace StudentCareSystem.Application.Services;
public class UserService(
    IHttpContextAccessor httpContextAccessor,
    IMapper mapper,
    IUnitOfWork unitOfWork
    ) : IUserService
{

    /// <summary>
    /// Save refresh token to the database
    /// </summary>
    /// <param name="user"></param>
    /// <param name="refreshToken"></param>
    public async Task SaveRefreshTokenAsync(User user, RefreshToken refreshToken)
    {
        user.RefreshTokens.Add(refreshToken);
        unitOfWork.UserRepository.Update(user);
        await unitOfWork.SaveChangesAsync();
    }

    /// <summary>
    /// Get user by email
    /// </summary>
    /// <param name="email"></param>
    /// <returns></returns>
    public async Task<User?> GetUserByEmailAsync()
    {
        var userEmail = ClaimsHelper.GetUserEmail(httpContextAccessor)
            ?? throw new EntityNotFoundException(MessageDescription.ExceptionMessageDescription.EntityNotFound("Email"));
        return await unitOfWork.UserRepository.GetByEmailAsync(userEmail)
            ?? throw new EntityNotFoundException(MessageDescription.ExceptionMessageDescription.EntityNotFound("User"));
    }

    /// <summary>
    /// Delete refresh token
    /// </summary>
    /// <param name="userRefreshToken"></param>
    public async Task DeleteRefreshToken(RefreshToken userRefreshToken)
    {
        //Delete the refresh token
        await unitOfWork.RefreshTokenRepository.DeleteAsync(userRefreshToken);
        await unitOfWork.SaveChangesAsync();
    }

    public async Task<IEnumerable<GetUserDto>> GetAllAsync()
    {
        var users = await unitOfWork.UserRepository.GetAllWithIncludeAsync();
        return mapper.Map<IEnumerable<GetUserDto>>(users);
    }

    /// <summary>
    /// Retrieves a paginated list of officers based on the specified filter.
    /// </summary>
    /// <param name="filter">The filter criteria for retrieving officers.</param>
    /// <param name="id">The unique identifier of the user.</param>
    /// <returns>A paginated list of officers.</returns>
    public async Task<Pagination<OfficerDto>> GetAllWithPaginationAsync(UserFilter filter)
    {
        var query = filter.Query?.Trim();
        var specification = new SpecificationBuilder<User>()
            .Include(a => a.Include(u => u.Role))
            .Include(a => a.Include(u => u.UserPermissions))
            .Where(a =>
                (string.IsNullOrEmpty(query)
                    || a.Email.Contains(query)
                    || a.FullName.Contains(query))
                && (!filter.Status.HasValue || a.Status == filter.Status)
                && (!filter.Role.HasValue || (a.Role != null && a.Role.RoleType == filter.Role))
            )
            .OrderBy(a => a.Id)
            .UseSplitQueries()
            .ApplyPaging(filter.PageNumber, filter.PageSize).Build();
        var officers = await unitOfWork.UserRepository.GetAllWithPaginationAsync(specification);
        return mapper.Map<Pagination<OfficerDto>>(officers);
    }

    /// <summary>
    /// Adds a new user to the repository.
    /// </summary>
    /// <param name="userDto">The user data transfer object containing user details.</param>
    /// <exception cref="EntityNotFoundException">
    /// Thrown when the permissions or majors specified in the userDto are not found.
    /// </exception>
    public async Task<GetUserDto> AddUserAsync(CreateUserDto userDto)
    {
        //Check the email
        await CheckEmailExist(userDto.Email);
        //Check the role
        await CheckRoleExist(userDto.RoleId);
        //Check the permissions
        await CheckPermissionExist(userDto.PermissionIds, userDto.RoleId);
        User user = mapper.Map<User>(userDto);
        await unitOfWork.UserRepository.AddAsync(user);
        //Log activity
        var userId = ClaimsHelper.GetUserId(httpContextAccessor);
        var activity = new Activity
        {
            ActivityDescription = ActivityDescription.AddUserDescription + $" [{user.Email}]",
            ActivityType = ActivityType.User,
            UserId = userId
        };
        await unitOfWork.ActivityRepository.AddAsync(activity);
        await unitOfWork.SaveChangesAsync();
        return mapper.Map<GetUserDto>(user);
    }

    public async Task<GetUserDetailDto> GetDetailAsync(Guid id)
    {
        var specification = new SpecificationBuilder<User>()
            .Where(a => a.Id == id)
            .Include(a => a.Include(u => u.Role))
            .Include(a => a.Include(u => u.UserPermissions).ThenInclude(p => p.Permission))
            .UseSplitQueries()
            .Build();
        var user = await unitOfWork.UserRepository.FirstOrDefaultAsync(specification)
            ?? throw new EntityNotFoundException(MessageDescription.ExceptionMessageDescription.EntityNotFound("User"));
        return mapper.Map<GetUserDetailDto>(user);
    }

    public async Task UpdateUserAsync(UpdateUserDto userDto)
    {
        var specification = new SpecificationBuilder<User>()
            .Where(a => a.Id == userDto.Id)
            .Include(a => a.Include(u => u.UserPermissions))
            .Build();
        var existingUser = await unitOfWork.UserRepository.FirstOrDefaultAsync(specification)
            ?? throw new EntityNotFoundException(MessageDescription.ExceptionMessageDescription.EntityNotFound("User"));
        // Check the email if it is changed
        if (existingUser.Email != userDto.Email)
        {
            await CheckEmailExist(userDto.Email);
            existingUser.Email = userDto.Email;
            existingUser.FeEmail = userDto.FeEmail;
        }
        // Check the role if it is changed
        if (existingUser.RoleId != userDto.RoleId)
        {
            await CheckRoleExist(userDto.RoleId);
            existingUser.RoleId = userDto.RoleId;
        }
        // Check the new permissions
        await CheckPermissionExist(userDto.PermissionIds, userDto.RoleId);
        // Clear the old permissions
        existingUser.UserPermissions.Clear();
        // Add the new permissions
        existingUser.UserPermissions = [.. userDto.PermissionIds.Select(p => new UserPermission { PermissionId = p })];
        // Update the user
        existingUser.FullName = userDto.FullName;
        existingUser.Status = userDto.Status;
        unitOfWork.UserRepository.Update(existingUser);
        // Log activity
        var userId = ClaimsHelper.GetUserId(httpContextAccessor);
        var activity = new Activity
        {
            ActivityDescription = ActivityDescription.UpdateUserDescription + $" [{existingUser.Email}]",
            ActivityType = ActivityType.User,
            UserId = userId
        };
        await unitOfWork.ActivityRepository.AddAsync(activity);
        await unitOfWork.SaveChangesAsync();
    }

    public async Task DeleteUserAsync(Guid userId)
    {
        var specification = new SpecificationBuilder<User>()
            .Where(a => a.Id == userId)
            .Include(a => a.Include(u => u.Role))
            .Build();
        var userToDelete = await unitOfWork.UserRepository.FirstOrDefaultAsync(specification)
            ?? throw new EntityNotFoundException(MessageDescription.ExceptionMessageDescription.EntityNotFound("User"));
        // Check if the user is an admin
        if (userToDelete?.Role?.RoleType == RoleType.Admin)
        {
            throw new BadRequestException(MessageDescription.ExceptionMessageDescription.EntityNotFound("Admin"));
        }
        await unitOfWork.UserRepository.Delete(userId);
        // Log activity
        var currentUserId = ClaimsHelper.GetUserId(httpContextAccessor);
        var activity = new Activity
        {
            ActivityDescription = ActivityDescription.DeleteUserDescription + $" [{userToDelete?.Email}]",
            ActivityType = ActivityType.User,
            UserId = currentUserId
        };
        await unitOfWork.ActivityRepository.AddAsync(activity);
        await unitOfWork.SaveChangesAsync();
    }

    /// <summary>
    /// Check if the permissions exist in the database
    /// </summary>
    /// <param name="permissionIds"></param>
    /// <returns></returns>
    private async Task CheckPermissionExist(HashSet<Guid> permissionIds, Guid roleId)
    {
        var permissions = await unitOfWork.PermissionRepository.GetByRoleAsync(roleId);
        foreach (var permissionId in permissionIds)
        {
            if (!permissions.Any(p => p.Id == permissionId))
            {
                throw new BadRequestException(MessageDescription.ExceptionMessageDescription.EntityNotFound("Permission"));
            }
        }
    }


    private async Task CheckRoleExist(Guid roleId)
    {
        if (await unitOfWork.RoleRepository.GetByIdAsync(roleId) == null)
        {
            throw new BadRequestException(MessageDescription.ExceptionMessageDescription.EntityNotFound("Role"));
        }
    }

    private async Task CheckEmailExist(string email)
    {
        var user = await unitOfWork.UserRepository.GetByEmailAsync(email);
        if (user != null)
        {
            throw new BadRequestException(MessageDescription.ExceptionMessageDescription.EntityAlreadyExists("Email"));
        }
    }
}
