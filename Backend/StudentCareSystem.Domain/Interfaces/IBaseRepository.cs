using StudentCareSystem.Domain.Helpers;

namespace StudentCareSystem.Domain.Interfaces;

public interface IBaseRepository<T> where T : class
{
    #region Insert

    Task<T> AddAsync(T entity);

    Task AddRangeAsync(IEnumerable<T> entities);

    Task AddBulkAsync(IEnumerable<T> entities, bool setOutputIdentity = false);

    #endregion

    #region Read

    Task<IEnumerable<T>> GetAllAsync();

    Task<IEnumerable<T>> GetAllAsync(ISpecification<T> specification);

    Task<Pagination<T>> GetAllWithPaginationAsync(ISpecification<T> specification);

    Task<bool> AnyAsync(ISpecification<T> specification);

    Task<int> CountAsync(ISpecification<T> specification);

    Task<T?> FirstOrDefaultAsync(ISpecification<T> specification);

    Task<T?> GetByIdAsync(object id);

    #endregion

    #region Update and Delete

    void Update(T entity);

    void UpdateRange(IEnumerable<T> entities);

    Task UpdateBulkAsync(IEnumerable<T> entities);

    void Delete(T entity);

    Task Delete(object id);

    void DeleteRange(IEnumerable<T> entities);

    Task DeleteBulkAsync(IEnumerable<T> entities);

    #endregion

}
