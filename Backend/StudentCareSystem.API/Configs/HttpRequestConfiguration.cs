using Hangfire;

using Microsoft.Extensions.Options;

using StudentCareSystem.API.Filters;
using StudentCareSystem.API.Middlewares;
using StudentCareSystem.Infrastructure.Models;

namespace StudentCareSystem.API.Configs;

public static class HttpRequestConfiguration
{
    /// <summary>
    /// Configures the HTTP request pipeline.
    /// </summary>
    /// <param name="app"></param>
    /// <param name="env"></param>
    public static void ConfigureHttpRequest(this IApplicationBuilder app, IHostEnvironment env)
    {
        var config = app.ApplicationServices.GetRequiredService<IOptions<GoogleSetting>>().Value;
        if (env.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "My API V1");

                //Configure OAuth2
                c.OAuth2RedirectUrl("http://localhost:8080/swagger/oauth2-redirect.html");
                c.OAuthClientId(config.ClientId);
                c.OAuthClientSecret(config.ClientSecret);
                c.OAuthAppName("Google OAuth with Swagger");
                c.OAuthScopes("openid", "profile", "email");
                c.OAuthUsePkce();

                c.EnablePersistAuthorization();
            });

        }

        app.UseRouting();
        app.UseCors("AllowAll");
        //Configure authentication and authorization
        app.UseAuthentication();
        app.UseAuthorization();
        //Configure Hangfire
        app.UseHangfireDashboard("/hangfire", new DashboardOptions
        {
            AsyncAuthorization = [new HangfireAuthorizationFilter(app.ApplicationServices.GetRequiredService<IOptions<HangfireSetting>>())],
            IgnoreAntiforgeryToken = true
        });
        app.UseHealthChecks();
        //Configure middleware
        app.UseMiddleware<ExceptionHandlingMiddleware>();
        app.UseMiddleware<PermissionMiddleware>();
        app.UseMiddleware<CheckSumMiddleware>();
        app.UseMiddleware<CsrfMiddleware>();
        app.UseMiddleware<StudentPsychologyValidationMiddleware>();
        //Configure endpoint
        app.UseEndpoints(endpoint =>
        {
            endpoint.MapControllers();
            endpoint.MapHangfireDashboard();
        });
    }
}
