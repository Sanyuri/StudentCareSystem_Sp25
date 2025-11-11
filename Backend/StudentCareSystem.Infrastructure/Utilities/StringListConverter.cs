namespace StudentCareSystem.Infrastructure.Utilities;

public static class StringListConverter
{
    /// <summary>
    /// Converts a string to a list of strings based on a custom delimiter.
    /// </summary>
    /// <param name="input">The input string to be converted into a list.</param>
    /// <param name="delimiter">The delimiter used to split the input string. Default is comma (",").</param>
    /// <returns>A List of strings obtained by splitting the input string based on the delimiter.</returns>
    /// <remarks>
    /// This method trims each item in the list to remove extra spaces and filters out empty or null items.
    /// </remarks>
    public static List<string> ConvertStringToList(string? input, string delimiter = ",")
    {
        // Return an empty list if the input is null or empty
        if (string.IsNullOrEmpty(input))
        {
            return [];
        }

        // Split the input string by the delimiter, trim spaces, and filter out empty values
        return input.Split([delimiter], StringSplitOptions.None)
                    .Select(item => item.Trim())
                    .Where(item => !string.IsNullOrEmpty(item))
                    .ToList();
    }

    /// <summary>
    /// Converts a list of strings back to a single string with a custom delimiter.
    /// </summary>
    /// <param name="list">The list of strings to be converted into a single string.</param>
    /// <param name="delimiter">The delimiter used to join the list items. Default is comma (",").</param>
    /// <returns>A string containing the list elements joined by the delimiter.</returns>
    /// <remarks>
    /// If the list is empty or null, the method returns an empty string.
    /// </remarks>
    public static string ConvertListToString(List<string>? list, string delimiter = ",")
    {
        // If the list is empty, return an empty string
        if (list == null || list.Count == 0)
        {
            return string.Empty;
        }

        // Join the list into a single string, with each item separated by the delimiter
        return string.Join(delimiter, list);
    }
}
