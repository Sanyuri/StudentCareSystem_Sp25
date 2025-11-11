using Microsoft.AspNetCore.Http;

using StudentCareSystem.Infrastructure.Aspects;

namespace StudentCareSystem.Application.Commons.Utilities;


public static class TimeZoneHelper
{
    /// <summary>
    /// Retrieves the time zone from a request header.
    /// If the header is not found or the value is empty, defaults to "UTC".
    /// </summary>
    /// <param name="context">The <see cref="HttpContext"/> for the current request.</param>
    /// <param name="headerName">The name of the header containing the time zone value. Defaults to "X-Timezone".</param>
    /// <returns>The time zone value from the specified header, or "UTC" if the header is missing or empty.</returns>
    /// <example>
    /// string timeZone = TimeZoneHelper.GetTimeZoneFromHeader(context);
    /// </example>
    [LoggingAspect]
    public static string GetTimeZoneFromHeader(HttpContext context, string headerName = "X-Timezone")
    {
        var timeZone = context.Request.Headers[headerName].ToString();
        return string.IsNullOrWhiteSpace(timeZone) ? "UTC" : timeZone;
    }

    /// <summary>
    /// Converts a given <see cref="DateTime"/> from UTC to the specified time zone.
    /// </summary>
    /// <param name="dateTime">The <see cref="DateTime"/> to be converted.</param>
    /// <param name="timeZone">The target time zone identifier (e.g., "Pacific Standard Time").</param>
    /// <returns>The <see cref="DateTime"/> converted to the specified time zone.</returns>
    /// <exception cref="TimeZoneNotFoundException">Thrown if the specified time zone is not found in the system's time zone database.</exception>
    /// <example>
    /// DateTime convertedTime = TimeZoneHelper.ConvertDateTimeToTimeZone(DateTime.UtcNow, "Pacific Standard Time");
    /// </example>
    public static DateTime ConvertDateTimeToTimeZone(DateTime dateTime, string timeZone)
    {
        var timeZoneInfo = TimeZoneInfo.FindSystemTimeZoneById(timeZone);
        return TimeZoneInfo.ConvertTime(dateTime, timeZoneInfo);
    }

    /// <summary>
    /// Converts a given <see cref="DateTime"/> from a specific time zone to UTC.
    /// </summary>
    /// <param name="dateTime">The <see cref="DateTime"/> to be converted.</param>
    /// <param name="timeZone">The source time zone identifier (e.g., "Pacific Standard Time").</param>
    /// <returns>The <see cref="DateTime"/> converted to UTC.</returns>
    /// <exception cref="TimeZoneNotFoundException">Thrown if the specified time zone is not found in the system's time zone database.</exception>
    /// <example>
    /// DateTime utcTime = TimeZoneHelper.ConvertDateTimeToUtcFromTimeZone(DateTime.Now, "Pacific Standard Time");
    /// </example>
    public static DateTime ConvertDateTimeToUtcFromTimeZone(DateTime dateTime, string timeZone)
    {
        var timeZoneInfo = TimeZoneInfo.FindSystemTimeZoneById(timeZone);
        return TimeZoneInfo.ConvertTimeToUtc(dateTime, timeZoneInfo);
    }

    /// <summary>
    /// Gets the current date and time in the specified time zone.
    /// </summary>
    /// <param name="timeZone">The time zone identifier (e.g., "Pacific Standard Time").</param>
    /// <returns>The current <see cref="DateTime"/> in the specified time zone.</returns>
    /// <exception cref="TimeZoneNotFoundException">Thrown if the specified time zone is not found in the system's time zone database.</exception>
    /// <example>
    /// DateTime currentTime = TimeZoneHelper.GetCurrentDateTimeInTimeZone("Pacific Standard Time");
    /// </example>
    public static DateTime GetCurrentDateTimeInTimeZone(string timeZone)
    {
        var timeZoneInfo = TimeZoneInfo.FindSystemTimeZoneById(timeZone);
        return TimeZoneInfo.ConvertTime(DateTime.UtcNow, timeZoneInfo);
    }

    /// <summary>
    /// Gets the current UTC date and time for the specified time zone.
    /// </summary>
    /// <param name="timeZone">The time zone identifier (e.g., "Pacific Standard Time").</param>
    /// <returns>The current UTC <see cref="DateTime"/> for the specified time zone.</returns>
    /// <exception cref="TimeZoneNotFoundException">Thrown if the specified time zone is not found in the system's time zone database.</exception>
    public static DateTime GetCurrentUtcDateTimeForTimeZone(string timeZone)
    {
        var timeZoneInfo = TimeZoneInfo.FindSystemTimeZoneById(timeZone);
        // Convert the current time in the specified time zone to UTC.
        var timeInZone = TimeZoneInfo.ConvertTime(DateTime.UtcNow, timeZoneInfo);
        return TimeZoneInfo.ConvertTimeToUtc(timeInZone, timeZoneInfo);
    }


}
