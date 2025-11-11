using Microsoft.AspNetCore.Http;

using StudentCareSystem.Domain.Entities;
using StudentCareSystem.Domain.Interfaces;
using StudentCareSystem.Infrastructure.Data;

namespace StudentCareSystem.Infrastructure.Repositories;

public class StudentApplicationRepository(ScsDbContext context, IHttpContextAccessor httpContextAccessor)
    : BaseRepository<StudentApplication>(context, httpContextAccessor), IStudentApplicationRepository
{
}
