using System.IdentityModel.Tokens.Jwt;
using System.Text;

using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

using StudentCareSystem.Application.Commons.Exceptions;
using StudentCareSystem.Application.Commons.Models;
using StudentCareSystem.Domain.Constants;
using StudentCareSystem.Infrastructure.Attributes;

namespace StudentCareSystem.API.Middlewares
{
    public class StudentPsychologyValidationMiddleware(RequestDelegate next, IOptions<JwtSetting> jwtSetting)
    {
        public async Task InvokeAsync(HttpContext context)
        {
            var endpoint = context.GetEndpoint();
            // Check if the endpoint has the StudentPsychology attribute
            if (endpoint?.Metadata?.GetMetadata<StudentPsychologyAttribute>() == null)
            {
                await next(context);
                return;
            }
            // Get the token from the request header
            var request = context.Request;
            var token = request.Headers["StudentPsychology"].FirstOrDefault();

            // Check if the token is null or empty
            if (string.IsNullOrEmpty(token))
            {
                throw new ForbiddenException(InvalidTokenDescription.InvalidToken);
            }

            // Validate the token
            var tokenHandler = new JwtSecurityTokenHandler();
            try
            {
                var jwtToken = tokenHandler.ValidateToken(token, new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSetting.Value.Secret)),
                    ValidAudience = jwtSetting.Value.Audience,
                    ValidIssuer = jwtSetting.Value.Issuer,
                    ValidateAudience = true,
                    ValidateIssuer = true,
                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.Zero
                }, out _);

                var studentCode = jwtToken.Claims.FirstOrDefault(claim => claim.Type == "StudentCode")?.Value;

                if (string.IsNullOrEmpty(studentCode))
                {
                    throw new ForbiddenException(InvalidTokenDescription.InvalidToken);
                }

                context.Items["StudentCode"] = studentCode;
                await next(context);
            }
            catch (Exception)
            {
                throw new ForbiddenException(InvalidTokenDescription.InvalidToken);
            }
        }
    }
}
