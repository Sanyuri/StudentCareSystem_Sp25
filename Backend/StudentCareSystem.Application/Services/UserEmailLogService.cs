using AutoMapper;

using Microsoft.EntityFrameworkCore;

using StudentCareSystem.Application.Commons.Interfaces;
using StudentCareSystem.Application.Commons.Models.UserEmailLogs;
using StudentCareSystem.Domain.Entities;
using StudentCareSystem.Domain.Helpers;
using StudentCareSystem.Domain.Interfaces;
using StudentCareSystem.Infrastructure.Specifications;

namespace StudentCareSystem.Application.Services;
public class UserEmailLogService(
    IMapper mapper,
    IUserEmailLogRepository useremailLogRepository
) : IUserEmailLogService
{
    public async Task<Pagination<GetUserEmailLogDto>> GetAllWithPaginationAsync(UserEmailLogFilter filter)
    {
        var query = filter.SearchValue?.Trim();
        var specification = new SpecificationBuilder<UserEmailLog>()
            .Where(e =>
                (string.IsNullOrEmpty(query)
                    || !string.IsNullOrEmpty(e.RecipientEmail) && e.RecipientEmail.Contains(query)
                )
                && (!filter.EmailState.HasValue || e.EmailState == filter.EmailState)
                && (string.IsNullOrEmpty(filter.SemesterName) || e.SemesterName.Contains(filter.SemesterName))
                && (!filter.EmailType.HasValue || e.EmailType == filter.EmailType)
                && (!filter.MinCreatedDate.HasValue || e.CreatedAt.Date >= filter.MinCreatedDate.Value.Date)
                && (!filter.MaxCreatedDate.HasValue || e.CreatedAt.Date <= filter.MaxCreatedDate.Value.Date)
            )
            .ApplyPaging(filter.PageNumber, filter.PageSize)
            .OrderByDescending(e => e.UpdatedAt ?? e.CreatedAt)
            .UseSplitQueries()
            .Build();
        var result = await useremailLogRepository.GetAllWithPaginationAsync(specification);
        return mapper.Map<Pagination<GetUserEmailLogDto>>(result);
    }

    public async Task<GetUserEmailLogDetailDto> GetByIdAsync(Guid id)
    {
        var UseremailLogSpecification = new SpecificationBuilder<UserEmailLog>()
            .Where(x => x.Id == id)
            .Build();
        var result = await useremailLogRepository.FirstOrDefaultAsync(UseremailLogSpecification);
        return mapper.Map<GetUserEmailLogDetailDto>(result);
    }
}
