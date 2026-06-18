namespace ExamForge.Domain.PaperGeneration;

public static class PercentageAllocator
{
    /// <summary>
    /// Converts percentage shares into integer counts that sum exactly to <paramref name="total"/>.
    /// Uses the largest-remainder method so rounding never loses or gains questions.
    /// </summary>
    public static IReadOnlyDictionary<TKey, int> Allocate<TKey>(
        int total,
        IReadOnlyDictionary<TKey, decimal> percentages)
        where TKey : notnull
    {
        if (total <= 0)
        {
            throw new ArgumentOutOfRangeException(nameof(total), "Total must be positive.");
        }

        if (percentages.Count == 0)
        {
            throw new ArgumentException("At least one percentage entry is required.", nameof(percentages));
        }

        var exact = percentages.ToDictionary(
            kvp => kvp.Key,
            kvp => total * kvp.Value / 100m);

        var allocated = exact.ToDictionary(kvp => kvp.Key, kvp => (int)Math.Floor(kvp.Value));
        var remainder = total - allocated.Values.Sum();

        if (remainder > 0)
        {
            var byFraction = exact
                .Select(kvp => new
                {
                    Key = kvp.Key,
                    Fraction = kvp.Value - allocated[kvp.Key]
                })
                .OrderByDescending(x => x.Fraction)
                .ThenBy(x => x.Key.ToString(), StringComparer.Ordinal)
                .Take(remainder);

            foreach (var entry in byFraction)
            {
                allocated[entry.Key]++;
            }
        }

        return allocated;
    }
}
