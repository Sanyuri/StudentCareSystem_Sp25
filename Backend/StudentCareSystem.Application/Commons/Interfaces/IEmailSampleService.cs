using StudentCareSystem.Application.Commons.Models.EmailSamples;
using StudentCareSystem.Domain.Helpers;

namespace StudentCareSystem.Application.Commons.Interfaces;

public interface IEmailSampleService
{
    Task<Pagination<GetEmailSampleDto>> GetAllWithPaginationAsync(EmailSampleFilter filter);
    Task<GetEmailSampleDto> GetByIdAsync(Guid guid);
    Task<GetEmailSampleDto> AddAsync(CreateEmailSampleDto emailSample);
    Task UpdateAsync(UpdateEmailSampleDto emailSample);
    Task DeleteAsync(Guid guid);

}
