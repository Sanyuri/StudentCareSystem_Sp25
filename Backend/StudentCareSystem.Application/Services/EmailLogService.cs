using AutoMapper;

using Microsoft.EntityFrameworkCore;

using StudentCareSystem.Application.Commons.Interfaces;
using StudentCareSystem.Application.Commons.Models.EmailLogs;
using StudentCareSystem.Domain.Entities;
using StudentCareSystem.Domain.Helpers;
using StudentCareSystem.Domain.Interfaces;
using StudentCareSystem.Infrastructure.Specifications;

namespace StudentCareSystem.Application.Services;
public class EmailLogService(
    IMapper mapper,
    IUnitOfWork unitOfWork
) : IEmailLogService
{
    public async Task<Pagination<GetEmailLogDto>> GetAllWithPaginationAsync(EmailLogFilter filter)
    {
        var query = filter.SearchValue?.Trim();
        var specification = new SpecificationBuilder<EmailLog>()
            .Where(e =>
                (string.IsNullOrEmpty(query)
                    || (e.StudentCode != null && e.StudentCode.Contains(query))
                    || (e.Student != null && e.Student.StudentName.Contains(query))
                    || !string.IsNullOrEmpty(e.RecipientEmail) && e.RecipientEmail.Contains(query)
                )
                && (!filter.EmailState.HasValue || e.EmailState == filter.EmailState)
                && (string.IsNullOrEmpty(filter.SemesterName) || e.SemesterName.Contains(filter.SemesterName))
                && (!filter.EmailType.HasValue || e.EmailType == filter.EmailType)
                && (!filter.MinCreatedDate.HasValue || e.CreatedAt.Date >= filter.MinCreatedDate.Value.Date)
                && (!filter.MaxCreatedDate.HasValue || e.CreatedAt.Date <= filter.MaxCreatedDate.Value.Date)
            )
            .Include(e => e.Include(x => x.Student))
            .ApplyPaging(filter.PageNumber, filter.PageSize)
            .OrderByDescending(e => e.UpdatedAt ?? e.CreatedAt)
            .UseSplitQueries()
            .Build();
        var result = await unitOfWork.EmailLogRepository.GetAllWithPaginationAsync(specification);
        return mapper.Map<Pagination<GetEmailLogDto>>(result);
    }

    public async Task<GetEmailLogDetailDto> GetByIdAsync(Guid id)
    {
        var emailLogSpecification = new SpecificationBuilder<EmailLog>()
            .Where(x => x.Id == id)
            .Include(x => x.Include(y => y.Student))
            .Build();
        var result = await unitOfWork.EmailLogRepository.FirstOrDefaultAsync(emailLogSpecification);
        return mapper.Map<GetEmailLogDetailDto>(result);
    }
}
