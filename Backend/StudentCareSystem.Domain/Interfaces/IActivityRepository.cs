using StudentCareSystem.Domain.Entities;

namespace StudentCareSystem.Domain.Interfaces;

public interface IActivityRepository : IBaseRepository<Activity>
{
    Task<IEnumerable<Activity>> GetAllActivity();
}
