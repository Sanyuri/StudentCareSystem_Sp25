using StudentCareSystem.Application.Mappings;

namespace StudentCareSystem.API.Configs.Autos;
public static class AutoMapperConfiguration
{
    /// <summary>
    /// Configures AutoMapper for generic type
    /// </summary>
    /// <param name="services"></param>
    public static void ConfigureAutoMapper(this IServiceCollection services)
    {
        services.AddAutoMapper(typeof(MapProfile).Assembly);
    }
}
