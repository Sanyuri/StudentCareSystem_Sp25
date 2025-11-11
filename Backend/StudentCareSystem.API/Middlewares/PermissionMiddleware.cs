using StudentCareSystem.Application.Commons.Exceptions;
using StudentCareSystem.Domain.Constants;
using StudentCareSystem.Infrastructure.Attributes;
using StudentCareSystem.Infrastructure.Utilities;

namespace StudentCareSystem.API.Middlewares;

public class PermissionMiddleware(RequestDelegate next)
{
    public async Task InvokeAsync(HttpContext context)
    {
        //get current user
        var user = context.User;
        //check if user is admin
        if (user.IsInRole("Admin"))
        {
            await next(context);
            return;
        }
        //check if user has permission to access the endpoint
        var endpoint = context.GetEndpoint();
        var requiredPermissionAttribute = endpoint?.Metadata.GetMetadata<RequiredPermissionAttribute>();
        if (requiredPermissionAttribute != null)
        {
            var requiredPermission = requiredPermissionAttribute.Permission;
            var userPermissionsClaim = context.User.FindFirst("Permissions")?.Value;
            var userPermissions = StringListConverter.ConvertStringToList(userPermissionsClaim);

            if (userPermissions == null || !userPermissions.Contains(requiredPermission))
            {
                throw new ForbiddenException(MessageDescription.ExceptionMessageDescription.ForbiddenException);
            }
        }

        await next(context);
    }
}
