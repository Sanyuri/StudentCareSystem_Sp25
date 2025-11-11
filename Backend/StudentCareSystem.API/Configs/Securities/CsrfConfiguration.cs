namespace StudentCareSystem.API.Configs.Securities;
public static class CsrfConfiguration
{
    /// <summary>
    /// Configure Anti Forgery
    /// </summary>
    /// <param name="services"></param>
    public static void ConfigureCsrf(this IServiceCollection services)
    {
        services.AddAntiforgery(options =>
        {
            options.HeaderName = "X-CSRF-TOKEN";
            options.Cookie.Name = "CSRF-TOKEN";
            options.SuppressXFrameOptionsHeader = false;
            options.Cookie.HttpOnly = false;
        });
    }
}
