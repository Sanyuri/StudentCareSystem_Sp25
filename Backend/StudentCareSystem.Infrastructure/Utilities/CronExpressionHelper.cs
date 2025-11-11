using System.Text;

namespace StudentCareSystem.Infrastructure.Utilities;

public static class CronExpressionHelper
{

    /// <summary>
    /// Adjusts a cron expression to shift times earlier by the specified minutes.
    /// </summary>
    /// <param name="cronExpression">The original cron expression.</param>
    /// <param name="minutesToAdjust">The number of minutes to adjust earlier.</param>
    /// <returns>A new cron expression adjusted to run earlier.</returns>
    public static string AdjustCronExpressionByMinutes(string cronExpression, int minutesToAdjust)
    {
        var parts = cronExpression.Split(' ');

        if (parts.Length < 5)
        {
            throw new ArgumentException("Invalid cron expression format. Ensure it has at least 5 fields: minute, hour, day, month, and day-of-week.");
        }

        // Extract the minute component
        var originalMinutes = int.Parse(parts[0]);

        // Adjust the minutes
        var adjustedMinutes = (originalMinutes - minutesToAdjust);
        int carryOverHours = 0;

        if (adjustedMinutes < 0)
        {
            carryOverHours = (Math.Abs(adjustedMinutes) + 59) / 60; // Carry over one or more hours
            adjustedMinutes = (60 + (adjustedMinutes % 60)) % 60;   // Wrap the minute to a positive value
        }

        // Handle the hours part
        string adjustedHoursExpression;
        if (parts[1] == "*")
        {
            // When the hour is "*", it means "every hour"
            // We don't need to modify it for carry over since it covers all hours
            adjustedHoursExpression = "*";
        }
        else
        {
            // Parse specific hours and adjust them
            var originalHours = parts[1].Split(',').Select(int.Parse).ToList();
            var adjustedHours = originalHours
                .Select(hour => (hour - carryOverHours + 24) % 24)
                .Distinct()
                .OrderBy(h => h)
                .ToList();

            adjustedHoursExpression = string.Join(",", adjustedHours);
        }

        // Rebuild the cron expression
        var sb = new StringBuilder();
        sb.Append($"{adjustedMinutes} {adjustedHoursExpression} {parts[2]} {parts[3]} {parts[4]}");

        // Add any additional parts (like seconds or year) if present in the original expression
        for (int i = 5; i < parts.Length; i++)
        {
            sb.Append(' ').Append(parts[i]);
        }

        return sb.ToString();
    }
}
