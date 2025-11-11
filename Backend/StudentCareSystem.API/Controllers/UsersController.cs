using AutoMapper;

using Microsoft.AspNetCore.Mvc;

using StudentCareSystem.Application.Commons.Exceptions;
using StudentCareSystem.Application.Commons.Interfaces;
using StudentCareSystem.Application.Commons.Models.Apis;
using StudentCareSystem.Application.Commons.Models.Users;
using StudentCareSystem.Domain.Constants;
using StudentCareSystem.Domain.Enums;
using StudentCareSystem.Domain.Helpers;
using StudentCareSystem.Infrastructure.Attributes;

namespace StudentCareSystem.API.Controllers;

public class UsersController(IUserService userService, IMapper mapper) : BaseController
{
    private readonly IUserService _userService = userService;
    private readonly IMapper _mapper = mapper;

    /// <summary>
    /// Get user details from access token
    /// </summary>
    /// <returns></returns>
    [HttpGet("me")]
    public async Task<IActionResult> GetCurrentUser()
    {
        var user = await _userService.GetUserByEmailAsync();
        // Check if the user is null
        if (user == null) throw new EntityNotFoundException("User not found");
        //Map the user to the UserDto
        var userDto = _mapper.Map<GetUserDto>(user);
        // Return the user details
        return Ok(new ApiResponse<GetUserDto>(
            200,
            MessageDescription.ApiResponseMessageDescription.Success,
            userDto));
    }

    /// <summary>
    /// Get user details by id
    /// </summary>
    /// <param name="id"></param>
    /// <returns></returns>
    [HttpGet("{id}")]
    [RequiredPermission(PermissionType.ReadUser)]
    public async Task<IActionResult> GetDetail(Guid id)
    {
        var user = await _userService.GetDetailAsync(id);
        return Ok(new ApiResponse<GetUserDetailDto>(
            200,
            MessageDescription.ApiResponseMessageDescription.Success,
            user));
    }

    /// <summary>
    /// Update user details
    /// </summary>
    /// <param name="addUserDto"></param>
    /// <returns></returns>
    [HttpPost("normal-user")]
    [RequiredPermission(PermissionType.WriteUser)]
    public async Task<IActionResult> CreateUser([FromBody] ApiRequest<CreateUserDto> addUserDto)
    {
        var result = await _userService.AddUserAsync(addUserDto.Data);
        return CreatedAtAction(nameof(GetDetail), new { id = result.Id },
            new ApiResponse<GetUserDto>(
                201,
                MessageDescription.ApiResponseMessageDescription.Created,
                result));
    }

    /// <summary>
    /// Update user details
    /// </summary>
    /// <param name="updateUserDto"></param>
    /// <returns></returns>
    [HttpPut("normal-user/{id}")]
    [RequiredPermission(PermissionType.WriteUser)]
    public async Task<IActionResult> UpdateUser(Guid id, [FromBody] ApiRequest<UpdateUserDto> updateUserDto)
    {
        if (id != updateUserDto.Data.Id)
        {
            return BadRequest(new ApiResponse<GetUserDto>(
                400,
                MessageDescription.ApiResponseMessageDescription.IdMismatch,
                null));
        }

        await _userService.UpdateUserAsync(updateUserDto.Data);
        return Ok(new ApiResponse<GetUserDto>(
            200,
            MessageDescription.ApiResponseMessageDescription.Updated,
            null));
    }

    [HttpDelete("normal-user/{id}")]
    [RequiredPermission(PermissionType.WriteUser)]
    public async Task<IActionResult> DeleteUser(Guid id)
    {
        await _userService.DeleteUserAsync(id);
        return Ok(new ApiResponse<GetUserDto>(
            200,
            MessageDescription.ApiResponseMessageDescription.Deleted,
            null));
    }

    /// <summary>
    /// Update user details
    /// </summary>
    /// <param name="filter"></param>
    /// <returns></returns>
    [HttpGet]
    // [RequiredPermission(PermissionType.ReadUser)]
    public async Task<IActionResult> GetAll([FromQuery] UserFilter filter)
    {
        var users = await _userService.GetAllWithPaginationAsync(filter);
        return Ok(new ApiResponse<Pagination<OfficerDto>>(
            200,
            MessageDescription.ApiResponseMessageDescription.Success,
            users));
    }
}
