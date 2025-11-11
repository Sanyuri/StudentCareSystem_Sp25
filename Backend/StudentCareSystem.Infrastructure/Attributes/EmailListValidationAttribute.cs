using System.ComponentModel.DataAnnotations;

namespace StudentCareSystem.Infrastructure.Attributes;

[AttributeUsage(AttributeTargets.Property | AttributeTargets.Field, AllowMultiple = false)]
public class EmailListValidationAttribute : ValidationAttribute
{
    protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
    {
        if (value is List<string> emailList)
        {
            var invalidEmails = new List<string>();
            var emailValidator = new EmailAddressAttribute();

            foreach (var email in emailList)
            {
                if (!emailValidator.IsValid(email))
                {
                    invalidEmails.Add(email);
                }
            }

            if (invalidEmails.Count > 0)
            {
                return new ValidationResult(
                    $"The following emails are invalid: {string.Join(", ", invalidEmails)}"
                );
            }
        }

        return ValidationResult.Success;
    }
}
