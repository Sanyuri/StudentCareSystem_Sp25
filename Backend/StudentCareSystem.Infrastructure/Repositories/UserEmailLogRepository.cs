using Microsoft.AspNetCore.Http;

using StudentCareSystem.Domain.Entities;
using StudentCareSystem.Domain.Interfaces;
using StudentCareSystem.Infrastructure.Data;

namespace StudentCareSystem.Infrastructure.Repositories;


public class UserEmailLogRepository(ScsDbContext context, IHttpContextAccessor httpContext) : BaseRepository<UserEmailLog>(context, httpContext), IUserEmailLogRepository
{

}
