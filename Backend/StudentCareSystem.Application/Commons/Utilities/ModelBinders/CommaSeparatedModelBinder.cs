using Microsoft.AspNetCore.Mvc.ModelBinding;

using StudentCareSystem.Infrastructure.Utilities;

namespace StudentCareSystem.Application.Commons.Utilities.ModelBinders;

public class CommaSeparatedModelBinder : IModelBinder
{
    public Task BindModelAsync(ModelBindingContext bindingContext)
    {
        var value = bindingContext.ValueProvider.GetValue(bindingContext.ModelName).ToString();
        if (string.IsNullOrEmpty(value))
        {
            bindingContext.Result = ModelBindingResult.Success(null);
            return Task.CompletedTask;
        }

        var values = StringListConverter.ConvertStringToList(value);
        bindingContext.Result = ModelBindingResult.Success(values);
        return Task.CompletedTask;
    }
}
