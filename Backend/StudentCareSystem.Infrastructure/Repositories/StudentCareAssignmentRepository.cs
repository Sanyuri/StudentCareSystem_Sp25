using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

using StudentCareSystem.Domain.Entities;
using StudentCareSystem.Domain.Enums;
using StudentCareSystem.Domain.Interfaces;
using StudentCareSystem.Infrastructure.Data;

namespace StudentCareSystem.Infrastructure.Repositories;

public class StudentCareAssignmentRepository(ScsDbContext context, IHttpContextAccessor httpContext)
: BaseRepository<StudentCareAssignment>(context, httpContext), IStudentCareAssignmentRepository
{
    // An function to count the number of assignments for each
    private readonly ScsDbContext _context = context;
    public async Task<Dictionary<User, Dictionary<CareStatus, int>>> GetAssignmentCountByUserBySemestername(string semesterName)
    {
        // First query: Group by UserId (primitive type) instead of User object
        var query = await _context.StudentCareAssignments
            .Where(sca => sca.User != null && sca.StudentNeedCare != null && sca.StudentNeedCare.SemesterName == semesterName)
            .GroupBy(sca => new { sca.UserId, sca.StudentNeedCare!.CareStatus })
            .Select(g => new
            {
                g.Key.UserId,
                g.Key.CareStatus,
                Count = g.Count()
            })
            .ToListAsync();

        // Second query: Get all relevant users in one go
        var userIds = query.Select(x => x.UserId).Distinct().ToList();
        var users = await _context.Users
            .Where(u => userIds.Contains(u.Id))
            .ToDictionaryAsync(u => u.Id);

        // Build the result dictionary
        var result = new Dictionary<User, Dictionary<CareStatus, int>>();
        foreach (var userGroup in query.GroupBy(x => x.UserId))
        {
            if (users.TryGetValue(userGroup.Key, out var user))
            {
                var statusCounts = userGroup
                    .ToDictionary(x => x.CareStatus, x => x.Count);

                result.Add(user, statusCounts);
            }
        }

        return result;
    }
}
