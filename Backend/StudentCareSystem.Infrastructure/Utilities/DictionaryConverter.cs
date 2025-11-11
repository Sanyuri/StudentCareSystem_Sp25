using System.Reflection;

namespace StudentCareSystem.Infrastructure.Utilities;

public static class DictionaryConverter
{
    /// <summary>
    /// Converts an entity to a dictionary with field/property names as keys
    /// and their primitive values as values.
    /// </summary>
    /// <typeparam name="T">Type of the entity.</typeparam>
    /// <param name="entity">The entity to convert.</param>
    /// <returns>A dictionary with field/property names and values.</returns>
    public static Dictionary<string, string> ConvertToDictionary<T>(T? entity) where T : class
    {
        if (entity != null)
        {
            var dictionary = new Dictionary<string, string>();

            // Get all primitive properties of the entity
            var properties = typeof(T).GetProperties(BindingFlags.Public | BindingFlags.Instance)
                .Where(p => p.CanRead && IsPrimitiveOrStringAndDatetime(p.PropertyType));

            foreach (var property in properties)
            {
                var value = property.GetValue(entity);
                // if the value is datetime, convert it to a string with the format "HH:mm:ss dd/MM/yyyy"
                if (property.PropertyType == typeof(DateTime))
                {
                    value = value != null ? ((DateTime)value).ToString("HH:mm:ss dd/MM/yyyy") : string.Empty;
                }
                // if the value is enum, convert it to a string
                else if (property.PropertyType.IsEnum)
                {
                    value = value != null ? value.ToString() : string.Empty;
                }
                dictionary.Add(property.Name, value?.ToString() ?? string.Empty);
            }

            return dictionary;
        }

        throw new ArgumentNullException(nameof(entity));
    }

    public static IEnumerable<Dictionary<string, string>> ConvertListToDictionary<T>(IEnumerable<T> entities) where T : class
    {
        return entities.Select(ConvertToDictionary);
    }

    /// <summary>
    /// Merges a new entity of a different type into the current dictionary.
    /// </summary>
    /// <typeparam name="T">Type of the current entity (existing dictionary's source).</typeparam>
    /// <typeparam name="TNew">Type of the new entity to add to the dictionary.</typeparam>
    /// <param name="currentDictionary">The current dictionary to merge into.</param>
    /// <param name="newEntity">The new entity to add to the dictionary.</param>
    public static void MergeEntityIntoDictionary<T, TNew>(Dictionary<string, string> currentDictionary, TNew newEntity)
        where T : class
        where TNew : class
    {
        // Check if T and TNew are different types
        if (typeof(T) == typeof(TNew))
        {
            throw new InvalidOperationException("Cannot merge entities of the same type.");
        }

        newEntity = newEntity ?? throw new ArgumentNullException(nameof(newEntity));

        // Convert the new entity to a dictionary
        var newEntityDictionary = ConvertToDictionary(newEntity);

        // Merge the new dictionary into the current dictionary
        foreach (var kvp in newEntityDictionary)
        {
            if (!currentDictionary.ContainsKey(kvp.Key))
            {
                currentDictionary.Add(kvp.Key, kvp.Value);
            }
        }
    }

    private static bool IsPrimitiveOrStringAndDatetime(Type type)
    {
        return type.IsPrimitive
               || type == typeof(string)
               || type == typeof(DateTime) // Include DateTime
               || type.IsEnum
               || type.IsGenericType && type.GetGenericTypeDefinition() == typeof(Nullable<>) &&
                  Nullable.GetUnderlyingType(type)!.IsPrimitive
               || Nullable.GetUnderlyingType(type) == typeof(DateTime); // Include Nullable<DateTime>
    }
}
