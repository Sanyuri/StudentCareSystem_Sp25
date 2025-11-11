using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;

using StudentCareSystem.Application.Commons.Interfaces;
using StudentCareSystem.Application.Commons.Models.Stringees;
using StudentCareSystem.Application.Commons.Utilities;
using StudentCareSystem.Infrastructure.Models;
using StudentCareSystem.Infrastructure.Utilities;

namespace StudentCareSystem.Application.Services;

public class StringeeService(
    IOptions<StringeeSettings> stringeeSetting,
    IHttpContextAccessor httpContextAccessor
) : IStringeeService
{
    private readonly StringeeSettings _stringeeSetting = stringeeSetting.Value;

    public Task<GetStringeeAccessTokenDto> CreateStringeeTokenASync()
    {
        var userId = ClaimsHelper.GetUserId(httpContextAccessor);
        var stringeeToken = TokenHelper.GenerateStringeeAccessToken(_stringeeSetting.ClientId,
                                _stringeeSetting.ClientSecret, _stringeeSetting.ExpiredTime, userId.ToString())
                            ?? throw new Exception("Failed to generate Stringee access token.");
        var stringeeAccessToken = new GetStringeeAccessTokenDto
        {
            AccessToken = stringeeToken,
            ExpiresIn = _stringeeSetting.ExpiredTime,
            PhoneNumber = _stringeeSetting.PhoneNumber,
        };
        return Task.FromResult(stringeeAccessToken);
    }
}
