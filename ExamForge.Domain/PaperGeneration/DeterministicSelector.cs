namespace ExamForge.Domain.PaperGeneration;

public static class DeterministicSelector
{
    public static Random CreateRandom(int seed, params object[] scope)
    {
        var combined = seed;
        foreach (var part in scope)
        {
            combined = HashCode.Combine(combined, part);
        }

        return new Random(combined);
    }

    public static List<T> TakeUnique<T>(
        IEnumerable<T> source,
        int count,
        Random random,
        ISet<Guid> excludedIds,
        Func<T, Guid> idSelector)
    {
        var candidates = source
            .Where(item => !excludedIds.Contains(idSelector(item)))
            .ToList();

        Shuffle(candidates, random);

        return candidates.Take(count).ToList();
    }

    public static void Shuffle<T>(IList<T> items, Random random)
    {
        for (var i = items.Count - 1; i > 0; i--)
        {
            var j = random.Next(i + 1);
            (items[i], items[j]) = (items[j], items[i]);
        }
    }
}
