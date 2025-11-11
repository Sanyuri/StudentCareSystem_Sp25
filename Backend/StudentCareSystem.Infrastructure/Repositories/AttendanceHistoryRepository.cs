using Microsoft.AspNetCore.Http;

using StudentCareSystem.Domain.Entities;
using StudentCareSystem.Domain.Interfaces;
using StudentCareSystem.Infrastructure.Data;

namespace StudentCareSystem.Infrastructure.Repositories;

public class AttendanceHistoryRepository(ScsDbContext context, IHttpContextAccessor httpContext) : BaseRepository<AttendanceHistory>(context, httpContext), IAttendanceHistoryRepository
{

}
