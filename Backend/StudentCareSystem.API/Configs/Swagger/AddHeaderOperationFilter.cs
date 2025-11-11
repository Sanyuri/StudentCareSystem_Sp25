using Microsoft.Extensions.Options;
using Microsoft.OpenApi.Any;
using Microsoft.OpenApi.Models;

using StudentCareSystem.API.Helpers;
using StudentCareSystem.Application.Commons.Models;

using Swashbuckle.AspNetCore.SwaggerGen;

namespace StudentCareSystem.API.Configs.Swagger;

public class AddHeaderOperationFilter(IOptions<CheckSumSetting> options) : IOperationFilter
{
    private readonly CheckSumSetting _checkSumSetting = options.Value;

    public void Apply(OpenApiOperation operation, OperationFilterContext context)
    {
        string checkSum = new CheckSumGeneration(_checkSumSetting).GenerateCheckSum("scs_hn");
        operation.Parameters ??= [];

        operation.Parameters.Add(new OpenApiParameter
        {
            Name = "Check-sum",
            In = ParameterLocation.Header,
            Required = false,
            Description = "For CampusCode SCS_HN",
            Schema = new OpenApiSchema
            {
                Type = "string"
            },
            Example = new OpenApiString(checkSum)
        });
        // Add header Authorization with Bearer
        operation.Parameters.Add(new OpenApiParameter
        {
            Name = "Authorization",
            In = ParameterLocation.Header,
            Required = false,
            Description = "Bearer-token",
            Schema = new OpenApiSchema
            {
                Type = "string"
            }
        });
        // Add header X-CSRF-TOKEN
        operation.Parameters.Add(new OpenApiParameter
        {
            Name = "X-CSRF-TOKEN",
            In = ParameterLocation.Header,
            Required = false,
            Description = "AntiForgery-token",
            Schema = new OpenApiSchema
            {
                Type = "string"
            }
        });
        // Add header CampusCode
        operation.Parameters.Add(new OpenApiParameter
        {
            Name = "CampusCode",
            In = ParameterLocation.Header,
            Required = true,
            Description = "CampusCode",
            Schema = new OpenApiSchema
            {
                Type = "string"
            },
            Example = new OpenApiString("scs_hn")
        });
        // Add header X-Timezone
        operation.Parameters.Add(new OpenApiParameter
        {
            Name = "X-Timezone",
            In = ParameterLocation.Header,
            Required = false,
            Description = "Timezone",
            Schema = new OpenApiSchema
            {
                Type = "string"
            },
            Example = new OpenApiString("Asia/Ho_Chi_Minh")
        });
    }
}
