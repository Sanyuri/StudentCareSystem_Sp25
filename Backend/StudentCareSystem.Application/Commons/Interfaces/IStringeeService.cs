using StudentCareSystem.Application.Commons.Models.Stringees;

namespace StudentCareSystem.Application.Commons.Interfaces;

public interface IStringeeService
{
    Task<GetStringeeAccessTokenDto> CreateStringeeTokenASync();
}
