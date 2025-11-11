using AutoMapper;

using Microsoft.EntityFrameworkCore;

using StudentCareSystem.Application.Commons.Interfaces;
using StudentCareSystem.Application.Commons.Models.Activities;
using StudentCareSystem.Domain.Entities;
using StudentCareSystem.Domain.Helpers;
using StudentCareSystem.Domain.Interfaces;
using StudentCareSystem.Infrastructure.Specifications;

namespace StudentCareSystem.Application.Services;
public class ActivityService(
    IMapper mapper,
    IUnitOfWork unitOfWork
) : IActivityService
{
    public async Task<IEnumerable<ActivitiesDto>> GetAllAsync()
    {
        var activities = await unitOfWork.ActivityRepository.GetAllActivity();
        return mapper.Map<IEnumerable<ActivitiesDto>>(activities);
    }

    public async Task<Pagination<ActivitiesDto>> GetAllWithPaginationAsync(ActivityFilter filter)
    {
        var specification = new SpecificationBuilder<Activity>()
            .Include(a => a.Include(u => u.User).ThenInclude(r => r != null ? r.Role : null))
            .Where(a =>
                (string.IsNullOrEmpty(filter.Email) || (a.User != null && a.User.Email.Contains(filter.Email))) &&
                (!filter.FromDate.HasValue || a.CreatedAt >= filter.FromDate) &&
                (!filter.ToDate.HasValue || a.CreatedAt <= filter.ToDate) &&
                (!filter.ActivityType.HasValue || a.ActivityType == filter.ActivityType)
            )
            .OrderByDescending(a => a.UpdatedAt ?? a.CreatedAt)
            .ApplyPaging(filter.PageNumber, filter.PageSize).Build();
        var activities = await unitOfWork.ActivityRepository.GetAllWithPaginationAsync(specification);
        return mapper.Map<Pagination<ActivitiesDto>>(activities);
    }
}
