using System.Linq.Expressions;

using StudentCareSystem.Domain.Interfaces;

namespace StudentCareSystem.Infrastructure.Specifications;

public class BaseSpecification<T>(Expression<Func<T, bool>>? criteria) : ISpecification<T>
{
    public Expression<Func<T, bool>>? Criteria { get; private set; } = criteria;
    public List<Func<IQueryable<T>, IQueryable<T>>> Includes { get; private set; } = [];
    public Expression<Func<T, object>>? OrderBy { get; private set; }
    public Expression<Func<T, object>>? OrderByDescending { get; private set; }
    public int Take { get; private set; }
    public int Skip { get; private set; }
    public bool IsPagingEnabled { get; private set; }
    public bool IncludeSoftDeleted { get; private set; } = false;
    public bool UseSplitQuery { get; private set; }

    public void AddInclude(Func<IQueryable<T>, IQueryable<T>> include)
    {
        Includes.Add(include);
    }
    public void AddOrderBy(Expression<Func<T, object>> orderByExpression)
    {
        OrderBy = orderByExpression;
    }
    public void AddOrderByDescending(Expression<Func<T, object>> orderByDescExpression)
    {
        OrderByDescending = orderByDescExpression;
    }
    public void ApplyPaging(int skip, int take)
    {
        Skip = skip;
        Take = take;
        IsPagingEnabled = true;
    }

    public void UseSplitQueries()
    {
        UseSplitQuery = true;
    }

}
