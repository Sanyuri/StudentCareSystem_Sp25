using Microsoft.EntityFrameworkCore;

using StudentCareSystem.Domain.Interfaces;

namespace StudentCareSystem.Infrastructure.Specifications;
public static class SpecificationEvaluator<T> where T : class
{
    public static IQueryable<T> GetQuery(IQueryable<T> inputQuery, ISpecification<T> specification)
    {
        var query = inputQuery;
        if (specification.Criteria != null)
        {
            query = query.Where(specification.Criteria);
        }

        query = specification.Includes.Aggregate(query, (current, include) => include(current));

        if (specification.OrderBy != null)
        {
            query = query.OrderBy(specification.OrderBy);
        }

        else if (specification.OrderByDescending != null)
        {
            query = query.OrderByDescending(specification.OrderByDescending);
        }

        if (specification.UseSplitQuery)
        {
            query = query.AsSplitQuery();
        }

        return query;
    }
}
