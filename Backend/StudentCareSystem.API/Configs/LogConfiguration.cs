using Elastic.CommonSchema;
using Elastic.CommonSchema.Serilog;

using Serilog;

namespace StudentCareSystem.API.Configs;

public static class LogConfiguration
{
    public static void ConfigureLog(this IHostBuilder host)
    {
        host.UseSerilog((context, loggerConfig) =>
        {
            loggerConfig.ReadFrom.Configuration(context.Configuration);
            loggerConfig.WriteTo.Console();
            loggerConfig.WriteTo.File(
                formatter: new EcsTextFormatter<EcsDocument>(),
                path: "Logs/log.txt",
                rollingInterval: RollingInterval.Day,
                retainedFileCountLimit: 100,
                rollOnFileSizeLimit: true,
                fileSizeLimitBytes: 10_000_000
            );
        });

    }
}
