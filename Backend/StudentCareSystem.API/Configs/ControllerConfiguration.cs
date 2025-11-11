using System.Text.Json;
using System.Text.Json.Serialization;

using StudentCareSystem.Application.Commons.Models.Apis;


namespace StudentCareSystem.API.Configs;
public static class ControllerConfiguration
{
    public static void ConfigureController(this IServiceCollection services)
    {
        services.AddControllers()
            .AddJsonOptions(options =>
            {
                options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
            })
            .ConfigureApiBehaviorOptions(options =>
            {
                options.InvalidModelStateResponseFactory = context =>
                {
                    var result = new CustomBadRequestObjectResult(context.ModelState);
                    return result;
                };
            });
        services.AddSwaggerGen();
        services.AddHttpContextAccessor();
    }
}
