using Microsoft.Extensions.Options;

using Polly;
using Polly.Extensions.Http;

using StudentCareSystem.Application.Commons.Models;
using StudentCareSystem.Infrastructure.ExternalServices;
using StudentCareSystem.Infrastructure.Models;
using StudentCareSystem.Infrastructure.Models.AIs;
using StudentCareSystem.Infrastructure.Models.EmailProxies;

using GoogleSetting = StudentCareSystem.Infrastructure.Models.GoogleSetting;

namespace StudentCareSystem.API.Configs;

public static class HttpClientConfiguration
{
    public static void ConfigureHttpClient(this IServiceCollection services, IConfiguration configuration)
    {
        ConfigureFapClient(services, configuration);
        ConfigureEmailProxyClient(services, configuration);
        ConfigureAIClient(services, configuration);
        ConfigureStringeeClient(services, configuration);
        ConfigureGoogleClient(services, configuration);
        ConfigureCheckSumClient(services, configuration);
        ConfigureJwtClient(services, configuration);
    }

    private static void ConfigureJwtClient(IServiceCollection services, IConfiguration configuration)
    {
        services.AddOptions<JwtSetting>()
            .Bind(configuration.GetSection("Jwt"))
            .ValidateDataAnnotations();
    }

    private static void ConfigureCheckSumClient(IServiceCollection services, IConfiguration configuration)
    {
        services.AddOptions<CheckSumSetting>()
            .Bind(configuration.GetSection("CheckSum"))
            .ValidateDataAnnotations();
    }

    public static void ConfigureGoogleClient(IServiceCollection services, IConfiguration configuration)
    {
        services.AddOptions<GoogleSetting>()
            .Bind(configuration.GetSection("GoogleSettings"))
            .ValidateDataAnnotations();
    }

    public static void ConfigureCors(IServiceCollection services, IConfiguration configuration)
    {
        services.AddOptions<CorsSetting>()
            .Bind(configuration.GetSection("Cors"))
            .ValidateDataAnnotations();
    }

    public static void ConfigureStringeeClient(IServiceCollection services, IConfiguration configuration)
    {
        services.AddOptions<StringeeSettings>()
            .Bind(configuration.GetSection("StringeeSettings"))
            .ValidateDataAnnotations();
    }

    public static void ConfigureFapClient(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddOptions<FapClientSetting>()
            .Bind(configuration.GetSection("FapClient"))
            .ValidateDataAnnotations();
        services.AddHttpClient<IFapService, FapService>((sp, client) =>
        {
            var fapClientSetting = sp.GetRequiredService<IOptions<FapClientSetting>>().Value;
            client.BaseAddress = new Uri(fapClientSetting.BaseAddress);
            client.DefaultRequestHeaders.Add("ClientCode", fapClientSetting.ClientCode);
            client.Timeout = TimeSpan.FromSeconds(1000);
        })
        .AddPolicyHandler(Policy.WrapAsync(GetRetryPolicy, GetCircuitBreakerPolicy));
    }

    public static void ConfigureEmailProxyClient(this IServiceCollection services, IConfiguration configuration)
    {
        services.Configure<EmailProxySetting>(configuration.GetSection("EmailProxy"));
        services.AddOptions<EmailProxySetting>()
            .Bind(configuration.GetSection("EmailProxy"))
            .ValidateDataAnnotations();
        services.AddHttpClient<IEmailProxyService, EmailProxyService>((sp, client) =>
        {
            var emailProxySetting = sp.GetRequiredService<IOptions<EmailProxySetting>>().Value;
            client.BaseAddress = new Uri(emailProxySetting.BaseAddress);
        })
        .AddPolicyHandler(GetRetryPolicy)
        .AddPolicyHandler(GetCircuitBreakerPolicy);
    }

    public static void ConfigureAIClient(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddOptions<AISettings>()
            .Bind(configuration.GetSection("AISettings"))
            .ValidateDataAnnotations();
        services.AddHttpClient<IAIService, AIService>((sp, client) =>
        {
            var aiSetting = sp.GetRequiredService<IOptions<AISettings>>().Value;
            client.BaseAddress = new Uri(aiSetting.BaseAddress);
            client.DefaultRequestHeaders.Add("X-Api-Key", aiSetting.Key);
            client.Timeout = TimeSpan.FromSeconds(10000);
        })
        .AddPolicyHandler(GetRetryPolicy)
        .AddPolicyHandler(GetCircuitBreakerPolicy);
    }

    // RetryPolicy
    private static IAsyncPolicy<HttpResponseMessage> GetRetryPolicy => HttpPolicyExtensions
            .HandleTransientHttpError()
            .WaitAndRetryAsync(6, retryAttempt => TimeSpan.FromSeconds(Math.Pow(2, retryAttempt)));

    // CircuitBreakerPolicy
    private static IAsyncPolicy<HttpResponseMessage> GetCircuitBreakerPolicy => HttpPolicyExtensions
            .HandleTransientHttpError()
            .CircuitBreakerAsync(15, TimeSpan.FromSeconds(10));

}
