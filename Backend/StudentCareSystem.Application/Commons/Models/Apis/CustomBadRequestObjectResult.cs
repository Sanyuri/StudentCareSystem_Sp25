using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace StudentCareSystem.Application.Commons.Models.Apis;

public class CustomBadRequestObjectResult : ObjectResult
{
    public CustomBadRequestObjectResult(ModelStateDictionary modelState)
    : base(new ApiResponse<object>(400, "Validation failed", modelState))
    {
        StatusCode = 400;
        ContentTypes.Add("application/json");
        ContentTypes.Add("application/xml");
    }
}

