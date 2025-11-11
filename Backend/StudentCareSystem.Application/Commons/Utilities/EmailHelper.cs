using System.Net.Mail;
using System.Text;
using System.Text.RegularExpressions;

using StudentCareSystem.Domain.Entities;

namespace StudentCareSystem.Application.Commons.Utilities;

public static partial class EmailHelper
{
    /// <summary>
    /// Generates an email content by replacing placeholders in the email template with provided parameters.
    /// </summary>
    /// <param name="content">The email template string containing placeholders.</param>
    /// <param name="parameters">A dictionary of key-value pairs representing the placeholders and their corresponding values.</param>
    /// <returns>The generated email string with placeholders replaced by their corresponding values.</returns>
    /// <exception cref="ArgumentException">Thrown when there are missing parameters in the email template.</exception>
    public static string ReplacePlaceholders(string content, Dictionary<string, string> parameters)
    {
        foreach (var parameter in parameters)
        {
            var highlightedValue = $"<strong>{parameter.Value}</strong>";
            content = content.Replace($"{{{{{parameter.Key}}}}}", highlightedValue); // Double curly braces
        }

        // Check if there are any missing parameters (using the regex pattern "{{[A-Za-z0-9_]+}}")
        var missingParameters = PlaceholderRegex().Matches(content)
            .Cast<Match>()
            .Select(m => m.Value)
            .ToList();
        if (missingParameters.Count > 0)
        {
            throw new ArgumentException($"Missing parameters: {string.Join(", ", missingParameters)}");
        }

        return content;
    }

    public static string ReplaceSubTemplates(
        string content,
        IEnumerable<EmailSubSample> subEmailSamples,
        Dictionary<string, object> data,
        string? delimiter = null)
    {
        var matches = ClusterPlaceHolder().Matches(content);

        foreach (Match match in matches)
        {
            var subTemplateName = match.Groups[1].Value;

            // Retrieve the corresponding sub-template
            var subTemplate = subEmailSamples.FirstOrDefault(s => s.Name == subTemplateName)
                ?? throw new ArgumentException($"Sub-template '{subTemplateName}' not found.");

            // Check if there is data for this sub-template
            if (data.TryGetValue(subTemplate.EmailType.ToString(), out var subTemplateData))
            {
                string processedContent;

                // If the data is a list, process each item individually
                if (subTemplateData is IEnumerable<Dictionary<string, string>> listData)
                {
                    var processedItems = listData.Select(item =>
                        ReplacePlaceholders(subTemplate.Content, item));
                    processedContent = string.Join(delimiter, processedItems);
                }
                else if (subTemplateData is Dictionary<string, string> singleData)
                {
                    // If the data is a single dictionary, process it
                    processedContent = ReplacePlaceholders(subTemplate.Content, singleData);
                }
                else
                {
                    throw new ArgumentException($"Invalid data format for sub-template '{subTemplateName}'.");
                }

                // Replace the placeholder with the processed content
                content = content.Replace(match.Value, processedContent);
            }
            else
            {
                throw new ArgumentException($"No data provided for sub-template '{subTemplateName}'.");
            }
        }

        return content;
    }

    /// <summary>
    /// Validates if all placeholders in the content have corresponding values in the parameters dictionary.
    /// </summary>
    /// <param name="content">The email template string containing placeholders.</param>
    /// <param name="parameters">A dictionary of key-value pairs representing the placeholders and their corresponding values.</param>
    /// <returns>True if all placeholders have corresponding values; otherwise, false.</returns>
    public static bool ValidatePlaceholders(string content, Dictionary<string, string> parameters)
    {
        var missingParameters = PlaceholderRegex().Matches(content)
            .Cast<Match>()
            .Select(m => m.Value.Trim('{', '}'))
            .Where(placeholder => !parameters.ContainsKey(placeholder))
            .ToList();

        return missingParameters.Count == 0;
    }

    /// <summary>
    /// Retrieves all placeholder names in the email content.
    /// </summary>
    /// <param name="content">The email template string containing placeholders.</param>
    /// <returns>An enumerable collection of placeholder names.</returns>
    public static List<string> GetAllSubTemplateNames(string content)
    {
        return [.. ClusterPlaceHolder().Matches(content)
            .Cast<Match>()
            .Select(m => m.Groups[1].Value)
            .Distinct()];
    }

    /// <summary>
    /// Generates a standardized email header with subject and date.
    /// </summary>
    /// <param name="baseSubject">The base subject of the email.</param>
    /// <param name="additionalInfo">Optional additional information to include in the header.</param>
    /// <returns>A formatted email header string.</returns>
    public static string GenerateEmailHeader(string baseSubject, string? additionalInfo = null)
    {
        var emailHeader = new StringBuilder(baseSubject);

        if (!string.IsNullOrEmpty(additionalInfo))
        {
            emailHeader.Append($" [{additionalInfo}]");
        }

        // Add the current date in [dd/MM/yyyy] format based on GMT+7
        emailHeader.Append($" [{DateTime.UtcNow.AddHours(7):dd/MM/yyyy}]");

        return emailHeader.ToString();
    }

    [GeneratedRegex("{{[A-Za-z0-9_ ]+}}")]
    private static partial Regex PlaceholderRegex();
    [GeneratedRegex(@"\[\[([A-Za-z0-9_ ]+)\]\]")]
    private static partial Regex ClusterPlaceHolder();

    /// <summary>
    /// Validates if the provided email address is in a valid format.
    /// </summary>
    /// <param name="email">The email address to validate.</param>
    /// <returns>True if the email address is valid; otherwise, false.</returns>
    public static bool IsValidEmail(string email)
    {
        try
        {
            var addr = new MailAddress(email);
            return addr.Address == email;
        }
        catch
        {
            return false;
        }
    }

}




