using StudentCareSystem.Application.Commons.Models.EmailSubSamples;
using StudentCareSystem.Domain.Helpers;


namespace StudentCareSystem.Application.Commons.Interfaces;

public interface IEmailSubSampleService
{
    Task<Pagination<GetEmailSubSampleDto>> GetAllWithPaginationAsync(EmailSubSampleFilter filter);
    Task<GetEmailSubSampleDto> GetByIdAsync(Guid guid);
    Task<GetEmailSubSampleDto> AddAsync(CreateEmailSubSampleDto emailSubSample);
    Task UpdateAsync(UpdateEmailSubSampleDto emailSubSample);
    Task DeleteAsync(Guid guid);

}
