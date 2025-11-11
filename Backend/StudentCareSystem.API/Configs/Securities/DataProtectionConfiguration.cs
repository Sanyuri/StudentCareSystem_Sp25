using Microsoft.AspNetCore.DataProtection;

using Serilog;

using StackExchange.Redis;

using StudentCareSystem.Domain.Constants;

namespace StudentCareSystem.API.Configs.Securities
{
    public static class DataProtectionConfiguration
    {
        /// <summary>
        /// Configure Data Protection
        /// </summary>
        /// <param name="services"></param>
        public static void ConfigureDataProtection(this IServiceCollection services, IConfiguration configuration, IWebHostEnvironment env)
        {
            var redisConnectionString = configuration.GetConnectionString("Redis");
            var application = "StudentCareSystem";

            try
            {
                if (env.IsDevelopment())
                {
                    services.AddDataProtection()
                        .PersistKeysToFileSystem(new DirectoryInfo(@"/app/.aspnet/DataProtection-Keys"))
                        .SetApplicationName(application);
                }
                else if (!string.IsNullOrEmpty(redisConnectionString))
                {
                    var redis = ConnectToRedis(redisConnectionString);
                    if (redis != null)
                    {
                        services.AddDataProtection()
                            .PersistKeysToStackExchangeRedis(redis, $"Scs-DataProtection-{env.EnvironmentName}")
                            .SetApplicationName(application);
                    }
                    else
                    {
                        Log.Warning(MessageDescription.RedisMessageDescription.RedisConnectionFailed);
                        services.AddDataProtection()
                            .PersistKeysToFileSystem(new DirectoryInfo(@"/app/.aspnet/DataProtection-Keys"))
                            .SetApplicationName(application);
                    }
                }
                else
                {
                    services.AddDataProtection()
                        .PersistKeysToFileSystem(new DirectoryInfo(@"/app/.aspnet/DataProtection-Keys"))
                        .SetApplicationName(application);
                }
            }
            catch (Exception ex)
            {
                Log.Error(ex, MessageDescription.RedisMessageDescription.RedisConfigurationExceptionMessage);
                throw;
            }
        }

        private static ConnectionMultiplexer? ConnectToRedis(string connectionString)
        {
            try
            {
                return ConnectionMultiplexer.Connect(connectionString);
            }
            catch (Exception ex)
            {
                Log.Error(ex, MessageDescription.RedisMessageDescription.RedisConnectionExceptionMessage);
                return null;  // Return null to use fallback mechanism in case of failure
            }
        }
    }
}
