namespace StudentCareSystem.Infrastructure.Cachings;

public interface IRedisCacheService
{
    Task SetAsync<T>(string key, T value, TimeSpan? expiry = null);

    Task<T?> GetTAsync<T>(string key);
    Task<bool> ExistsAsync(string key);
    Task RemoveAsync(string key);
}
