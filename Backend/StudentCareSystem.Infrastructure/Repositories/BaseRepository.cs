using EFCore.BulkExtensions;

using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

using StudentCareSystem.Domain.Helpers;
using StudentCareSystem.Domain.Interfaces;
using StudentCareSystem.Infrastructure.Data;
using StudentCareSystem.Infrastructure.Specifications;
using StudentCareSystem.Infrastructure.Utilities;

namespace StudentCareSystem.Infrastructure.Repositories;

public abstract class BaseRepository<T> where T : class, IEntity
{
    private readonly DbSet<T> _dbSet;
    private readonly ScsDbContext _context;
    private readonly IHttpContextAccessor _contextAccessor;

    protected BaseRepository(ScsDbContext context, IHttpContextAccessor contextAccessor)
    {
        _context = context;
        _dbSet = context.Set<T>();
        _contextAccessor = contextAccessor;
    }

    #region Insert

    public async Task<T> AddAsync(T entity)
    {
        var result = await _dbSet.AddAsync(entity);
        return result.Entity;
    }

    public async Task AddRangeAsync(IEnumerable<T> entities)
    {
        await _dbSet.AddRangeAsync(entities);
    }

    public async Task AddBulkAsync(IEnumerable<T> entities, bool setOutputIdentity = false)
    {
        foreach (var entity in entities)
        {
            AuditHelper.AuditInformation(entity, EntityState.Added, GetCurrentUsername());
        }
        var config = new BulkConfig
        {
            SetOutputIdentity = setOutputIdentity,
            PreserveInsertOrder = true,
        };
        await _context.BulkInsertAsync(entities, config);
    }

    #endregion

    #region Read

    public async Task<IEnumerable<T>> GetAllAsync() => await _dbSet.ToListAsync();

    public async Task<IEnumerable<T>> GetAllAsync(ISpecification<T> specification)
    {
        var query = SpecificationEvaluator<T>.GetQuery(_dbSet.AsQueryable(), specification);
        return await query.ToListAsync();
    }

    public async Task<Pagination<T>> GetAllWithPaginationAsync(ISpecification<T> specification)
    {
        var query = SpecificationEvaluator<T>.GetQuery(_dbSet.AsQueryable(), specification);
        var itemCount = await query.CountAsync();
        if (specification.IsPagingEnabled)
        {
            query = query.Skip(specification.Skip).Take(specification.Take);
        }

        var item = await query.ToListAsync();

        return new Pagination<T>
        {
            PageIndex = specification.Take > 0 ? (specification.Skip / specification.Take) + 1 : 1,
            PageSize = specification.Take,
            TotalItems = itemCount,
            Items = item
        };
    }

    public async Task<bool> AnyAsync(ISpecification<T> specification)
    {
        var query = SpecificationEvaluator<T>.GetQuery(_dbSet.AsQueryable(), specification);
        return await query.AnyAsync();
    }

    public async Task<int> CountAsync(ISpecification<T> specification)
    {
        var query = SpecificationEvaluator<T>.GetQuery(_dbSet.AsQueryable(), specification);
        return await query.CountAsync();
    }

    public async Task<T?> FirstOrDefaultAsync(ISpecification<T> specification)
    {
        var query = SpecificationEvaluator<T>.GetQuery(_dbSet.AsQueryable(), specification);
        return await query.FirstOrDefaultAsync();
    }

    public async Task<T?> GetByIdAsync(object id) => await _dbSet.FindAsync(id);

    #endregion

    #region Update and Delete

    public void Update(T entity)
    {
        _dbSet.Update(entity);
    }

    public void UpdateRange(IEnumerable<T> entities)
    {
        _dbSet.UpdateRange(entities);
    }

    public async Task UpdateBulkAsync(IEnumerable<T> entities)
    {
        foreach (var entity in entities)
        {
            AuditHelper.AuditInformation(entity, EntityState.Modified, GetCurrentUsername());
        }
        await _context.BulkUpdateAsync(entities);
    }

    public void Delete(T entity)
    {
        _dbSet.Remove(entity);
    }

    public async Task Delete(object id)
    {
        var entity = await GetByIdAsync(id);
        if (entity != null)
        {
            Delete(entity);
        }
    }

    public void DeleteRange(IEnumerable<T> entities)
    {
        _dbSet.RemoveRange(entities);
    }

    public async Task DeleteBulkAsync(IEnumerable<T> entities)
    {
        foreach (var entity in entities)
        {
            AuditHelper.AuditInformation(entity, EntityState.Deleted, GetCurrentUsername());
        }
        await _context.BulkUpdateAsync(entities);
    }
    #endregion

    private string? GetCurrentUsername()
    {
        return ClaimsHelper.GetUserEmail(_contextAccessor);
    }
}
