using System.Linq.Expressions;

namespace StudentCareSystem.Domain.Interfaces;

public interface ISpecification<T>
{
    /// <summary>
    /// Criteria to filter entities
    /// </summary>
    Expression<Func<T, bool>>? Criteria { get; }
    /// <summary>
    /// List of includes for entities
    /// </summary>
    List<Func<IQueryable<T>, IQueryable<T>>> Includes { get; }
    /// <summary>
    /// Order by for entities
    /// </summary>
    Expression<Func<T, object>>? OrderBy { get; }
    /// <summary>
    /// Order by descending for entities
    /// </summary>
    Expression<Func<T, object>>? OrderByDescending { get; }
    // This part is for pagination
    int Take { get; }
    int Skip { get; }
    bool IsPagingEnabled { get; }
    bool UseSplitQuery { get; }
}
