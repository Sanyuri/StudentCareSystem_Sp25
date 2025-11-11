namespace StudentCareSystem.API.Configs.Autos;
public static class AutosConfiguration
{
    /// <summary>
    /// Configures Autos
    /// </summary>
    /// <param name="services"></param>
    public static void ConfigureAutos(this IServiceCollection services)
    {
        services.ConfigureAutoRegisterServices();
        services.ConfigureAutoMapper();
    }
}
