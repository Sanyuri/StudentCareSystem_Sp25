using System.ComponentModel.DataAnnotations;

using Microsoft.AspNetCore.Antiforgery;
using Microsoft.AspNetCore.Mvc;

using StudentCareSystem.Domain.Constants;

namespace StudentCareSystem.API.Middlewares;

public class CsrfMiddleware(RequestDelegate next, IAntiforgery antiForgery)
{
    private readonly RequestDelegate _next = next;
    private readonly IAntiforgery _antiForgery = antiForgery;
    /// <summary>
    /// Invokes the middleware.
    /// </summary>
    /// <param name="context"></param>
    /// <exception cref="ValidationException"></exception>
    public async Task InvokeAsync(HttpContext context)
    {
        // Check if the request is a POST, PUT, or DELETE
        if (HttpMethods.IsPost(context.Request.Method) ||
            HttpMethods.IsPut(context.Request.Method) ||
            HttpMethods.IsDelete(context.Request.Method))
        {
            var endpoint = context.GetEndpoint();
            // Check if the endpoint has the IgnoreAntiForgeryTokenAttribute
            if (endpoint?.Metadata.GetMetadata<IgnoreAntiforgeryTokenAttribute>() != null)
            {
                await _next(context);
                return;
            }
            try
            {
                // Validate the request
                await _antiForgery.ValidateRequestAsync(context);
            }
            catch (AntiforgeryValidationException exception)
            {
                throw new ValidationException(MessageDescription.ExceptionMessageDescription.Invalid("CSRF token"), exception);
            }
        }
        await _next(context);
    }
}
