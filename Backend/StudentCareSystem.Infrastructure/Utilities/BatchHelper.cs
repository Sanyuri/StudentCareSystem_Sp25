using Serilog;

namespace StudentCareSystem.Infrastructure.Utilities;

public static class BatchHelper
{
    /// <summary>
    /// Splits a list into smaller lists (chunks) of a specified size.
    /// </summary>
    /// <typeparam name="T">The type of elements in the list.</typeparam>
    /// <param name="list">The original list to be split.</param>
    /// <param name="chunkSize">The size of each chunk.</param>
    /// <returns>An IEnumerable of chunks (each chunk is a List of elements).</returns>
    public static IEnumerable<List<T>> Batch<T>(List<T> list, int chunkSize)
    {
        ValidateParameters(list, chunkSize);
        for (int i = 0; i < list.Count; i += chunkSize)
        {
            yield return list.GetRange(i, Math.Min(chunkSize, list.Count - i));
        }
    }

    /// <summary>
    /// Splits a list into smaller lists (chunks) of a specified size, with an optional processing step on each chunk.
    /// </summary>
    /// <typeparam name="T">The type of elements in the list.</typeparam>
    /// <param name="list">The original list to be split.</param>
    /// <param name="chunkSize">The size of each chunk.</param>
    /// <param name="processor">A delegate to process each chunk (optional).</param>
    /// <returns>An IEnumerable of processed chunks.</returns>
    public static IEnumerable<List<T>> Batch<T>(List<T> list, int chunkSize, Action<List<T>> processor)
    {
        ValidateParameters(list, chunkSize);

        for (int i = 0; i < list.Count; i += chunkSize)
        {
            var chunk = list.GetRange(i, Math.Min(chunkSize, list.Count - i));

            processor?.Invoke(chunk);

            yield return chunk;
        }
    }

    /// <summary>
    /// Splits a list into smaller lists (chunks) of a specified size and returns the chunks as arrays instead of lists.
    /// </summary>
    /// <typeparam name="T">The type of elements in the list.</typeparam>
    /// <param name="list">The original list to be split.</param>
    /// <param name="chunkSize">The size of each chunk.</param>
    /// <returns>An IEnumerable of chunks (each chunk is an array of elements).</returns>
    public static IEnumerable<T[]> BatchToArray<T>(List<T> list, int chunkSize)
    {
        ValidateParameters(list, chunkSize);
        for (int i = 0; i < list.Count; i += chunkSize)
        {
            yield return list.GetRange(i, Math.Min(chunkSize, list.Count - i)).ToArray();
        }
    }

    private static void ValidateParameters<T>(List<T> list, int chunkSize)
    {
        if (list == null)
            throw new ArgumentNullException(nameof(list), "Input list cannot be null.");

        if (chunkSize <= 0)
            throw new ArgumentOutOfRangeException(nameof(chunkSize), "Chunk size must be greater than zero.");
    }

    public static async Task ProcessInBatchesAsync<T>(
    List<T> list,
    int batchSize,
    Func<List<T>, int, int, Task> processBatchAsync,
    string? actionName = null // Add this parameter
    )
    {
        ValidateParameters(list, batchSize);
        int total = list.Count;
        int processed = 0;
        int totalBatches = (int)Math.Ceiling((double)total / batchSize);
        int batchIndex = 0;

        for (int i = 0; i < total; i += batchSize)
        {
            batchIndex++;
            var chunk = list.GetRange(i, Math.Min(batchSize, total - i));
            try
            {
                await processBatchAsync(chunk, batchIndex, totalBatches);
            }
            catch (Exception ex)
            {
                Log.Error(
                    ex,
                    "[{ActionName}] Failed to process batch {BatchIndex}/{TotalBatches}. Failed batch items: {Chunk}",
                    actionName ?? "BatchProcess", batchIndex, totalBatches, string.Join(", ", chunk)
                );
            }
            processed += chunk.Count;
            double percent = (double)processed / total * 100;
            Log.Information(
                "[{ActionName}] Processed {Processed}/{Total} items ({Percent:F2}%)",
                actionName ?? "BatchProcess", processed, total, percent
            );
        }
    }
}

