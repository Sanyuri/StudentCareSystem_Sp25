using System.Text;

using Hangfire.Annotations;
using Hangfire.Dashboard;

using Microsoft.Extensions.Options;

using StudentCareSystem.Infrastructure.Models;

namespace StudentCareSystem.API.Filters
{
    public class HangfireAuthorizationFilter(IOptions<HangfireSetting> options) : IDashboardAsyncAuthorizationFilter
    {
        private readonly HangfireSetting _options = options.Value;

        public Task<bool> AuthorizeAsync([NotNull] DashboardContext context)
        {
            var httpContext = context.GetHttpContext();

            if (!httpContext.Request.Headers.TryGetValue("Authorization", out var authHeader))
            {
                httpContext.Response.StatusCode = 401;
                httpContext.Response.Headers["WWW-Authenticate"] = "Basic realm=\"Hangfire\"";
                return Task.FromResult(false);
            }


            if (!authHeader.ToString().StartsWith("Basic ", StringComparison.OrdinalIgnoreCase))
            {
                httpContext.Response.StatusCode = 401; // Unauthorized
                return Task.FromResult(false);
            }

            var encodedCredentials = authHeader.ToString()["Basic ".Length..].Trim();
            var decodedCredentials = Encoding.UTF8.GetString(Convert.FromBase64String(encodedCredentials));
            var credentials = decodedCredentials.Split(':', 2);

            if (credentials.Length != 2)
            {
                httpContext.Response.StatusCode = 401;
                return Task.FromResult(false);
            }

            var username = credentials[0];
            var password = credentials[1];

            if (username == _options.Username && password == _options.Password)
            {
                return Task.FromResult(true);
            }

            httpContext.Response.StatusCode = 401;
            return Task.FromResult(false);
        }
    }
}
