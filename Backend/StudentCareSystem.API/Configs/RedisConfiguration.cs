using StackExchange.Redis;

using StudentCareSystem.Domain.Constants;
using StudentCareSystem.Infrastructure.Cachings;

namespace StudentCareSystem.API.Configs;

public static class RedisConfiguration
{
    public static void ConfigureRedisServer(this IServiceCollection services, IConfiguration configuration)
    {
        var redisConnectionString = configuration.GetConnectionString("Redis");

        if (string.IsNullOrEmpty(redisConnectionString))
        {
            throw new InvalidOperationException($"Redis {MessageDescription.ConnectionStringMessageDescription.ConnectionStringNotConfiguredProperly}");
        }

        services.AddSingleton<IConnectionMultiplexer>(ConnectionMultiplexer.Connect(redisConnectionString));
        services.AddSingleton<IRedisCacheService, RedisCacheService>();
    }
}
