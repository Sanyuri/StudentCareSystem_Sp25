using System.ComponentModel.DataAnnotations;

namespace StudentCareSystem.Infrastructure.Attributes;

[AttributeUsage(AttributeTargets.Property | AttributeTargets.Field, AllowMultiple = false)]


public class FptEmailValidationAttribute : ValidationAttribute
{

    /// <summary>
    /// Validates that the provided email address ends with either "fpt.edu.vn" or "fe.edu.vn".
    /// Null values are considered valid.
    /// </summary>
    /// <param name="value">The value to validate, expected to be a string representing an email address.</param>
    /// <param name="validationContext">The context information about the validation operation.</param>
    /// <returns>
    /// A <see cref="ValidationResult"/> indicating whether the email address is valid.
    /// Returns a validation error if the email does not end with "fpt.edu.vn" or "fe.edu.vn";
    /// otherwise, returns <see cref="ValidationResult.Success"/>.
    /// </returns>
    protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
    {
        // If value is null, consider it valid
        if (value == null)
        {
            return ValidationResult.Success;
        }

        if (value is string email && !email.EndsWith("fpt.edu.vn") && !email.EndsWith("fe.edu.vn"))
        {
            return new ValidationResult("Email must have domain fpt.edu.vn or fe.edu.vn");
        }
        return ValidationResult.Success;
    }
}
