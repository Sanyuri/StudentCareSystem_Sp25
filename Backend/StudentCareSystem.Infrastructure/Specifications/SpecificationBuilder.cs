using System.Linq.Expressions;

using StudentCareSystem.Domain.Interfaces;

namespace StudentCareSystem.Infrastructure.Specifications;

public class SpecificationBuilder<T>
{
    private Expression<Func<T, bool>>? _criteria;
    private readonly List<Func<IQueryable<T>, IQueryable<T>>> _includes = [];
    private Expression<Func<T, object>>? _orderBy;
    private Expression<Func<T, object>>? _orderByDescending;
    private int _skip;
    private int _take;
    private bool _isPagingEnabled = false;
    private bool _useSplitQuery = false;

    public SpecificationBuilder<T> Where(Expression<Func<T, bool>> criteria)
    {
        _criteria = criteria;
        return this;
    }

    public SpecificationBuilder<T> Include(Func<IQueryable<T>, IQueryable<T>> includeExpression)
    {
        _includes.Add(includeExpression);
        return this;
    }

    public SpecificationBuilder<T> OrderBy(Expression<Func<T, object>> orderByExpression)
    {
        _orderBy = orderByExpression;
        return this;
    }

    public SpecificationBuilder<T> OrderByDescending(Expression<Func<T, object>> orderByDescExpression)
    {
        _orderByDescending = orderByDescExpression;
        return this;
    }

    public SpecificationBuilder<T> UseSplitQueries()
    {
        _useSplitQuery = true;
        return this;
    }

    /// <summary>
    /// Apply paging to the query
    /// </summary>
    /// <param name="pagesNumber"></param>
    /// <param name="pageSize"></param>
    /// <returns></returns>
    public SpecificationBuilder<T> ApplyPaging(int pagesNumber, int pageSize)
    {
        _skip = (pagesNumber - 1) * pageSize;
        _take = pageSize;
        _isPagingEnabled = true;
        return this;
    }

    public ISpecification<T> Build()
    {
        var baseSpecification = new BaseSpecification<T>(_criteria);
        foreach (var include in _includes)
        {
            baseSpecification.AddInclude(include);
        }
        if (_orderBy != null)
        {
            baseSpecification.AddOrderBy(_orderBy);
        }
        else if (_orderByDescending != null)
        {
            baseSpecification.AddOrderByDescending(_orderByDescending);
        }
        if (_isPagingEnabled)
        {
            baseSpecification.ApplyPaging(_skip, _take);
        }
        if (_useSplitQuery)
        {
            baseSpecification.UseSplitQueries();
        }
        return baseSpecification;
    }
}
