using ExamForge.Domain.Common;
using ExamForge.Domain.Entities;
using ExamForge.Domain.Enums;
using ExamForge.Domain.Exceptions;

namespace ExamForge.Domain.PaperGeneration;

public sealed class PaperGenerationEngine
{
    public GeneratedPaperResult Generate(
        PaperGenerationCriteria criteria,
        IReadOnlyList<Question> questionPool)
    {
        ValidateCriteria(criteria);

        var seed = criteria.Seed ?? ComputeDefaultSeed(criteria);
        var activePool = questionPool
            .Where(q => q.SubjectId == criteria.SubjectId && q.IsActive && !q.IsDeleted)
            .ToList();

        var typeCounts = PercentageAllocator.Allocate(
            criteria.TotalQuestions,
            criteria.TypePercentages);

        var shortfalls = ValidatePool(activePool, typeCounts, criteria.TeacherDistribution);
        if (shortfalls.Count > 0)
        {
            throw new InsufficientQuestionPoolException(
                BuildShortfallMessage(shortfalls),
                shortfalls);
        }

        var selectedIds = new HashSet<Guid>();
        var sections = new List<GeneratedPaperSection>();

        foreach (var type in typeCounts.Keys.OrderBy(t => (int)t))
        {
            var requiredForType = typeCounts[type];
            if (requiredForType == 0)
            {
                continue;
            }

            var typePool = activePool.Where(q => q.Type == type).ToList();
            var selectedForType = SelectForType(
                type,
                typePool,
                requiredForType,
                criteria.TeacherDistribution,
                seed,
                selectedIds);

            if (selectedForType.Count < requiredForType)
            {
                throw new InsufficientQuestionPoolException(
                    $"Not enough {type} questions could be selected without duplicates.",
                    [
                        new QuestionPoolShortfall(
                            type,
                            requiredForType,
                            selectedForType.Count,
                            null,
                            "All teachers")
                    ]);
            }

            sections.Add(new GeneratedPaperSection
            {
                Type = type,
                RequestedCount = requiredForType,
                Questions = selectedForType
            });
        }

        var allSelected = sections.SelectMany(s => s.Questions).ToList();

        return new GeneratedPaperResult
        {
            SubjectId = criteria.SubjectId,
            Seed = seed,
            TotalQuestions = allSelected.Count,
            TotalMarks = allSelected.Sum(q => q.Marks),
            Sections = sections
        };
    }

    private static List<Question> SelectForType(
        QuestionType type,
        IReadOnlyList<Question> typePool,
        int requiredCount,
        IReadOnlyList<TeacherShare>? teacherDistribution,
        int seed,
        ISet<Guid> selectedIds)
    {
        if (teacherDistribution is null || teacherDistribution.Count == 0)
        {
            var random = DeterministicSelector.CreateRandom(seed, type, "all");
            var selectedQuestions = DeterministicSelector.TakeUnique(
                typePool,
                requiredCount,
                random,
                selectedIds,
                q => q.Id);

            foreach (var question in selectedQuestions)
            {
                selectedIds.Add(question.Id);
            }

            return selectedQuestions;
        }

        var teacherCounts = PercentageAllocator.Allocate(
            requiredCount,
            teacherDistribution.ToDictionary(
                share => TeacherBucketKey(share.TeacherId),
                share => share.Percentage));

        var explicitTeacherIds = teacherDistribution
            .Where(share => share.TeacherId.HasValue)
            .Select(share => share.TeacherId!.Value)
            .ToHashSet();

        var selected = new List<Question>();

        foreach (var bucket in teacherCounts.OrderBy(kvp => kvp.Key))
        {
            var bucketCount = bucket.Value;
            if (bucketCount == 0)
            {
                continue;
            }

            var bucketTeacherId = ParseTeacherBucketKey(bucket.Key);
            IEnumerable<Question> bucketPool = bucketTeacherId switch
            {
                { } teacherId => typePool.Where(q => q.CreatedById == teacherId),
                null => explicitTeacherIds.Count > 0
                    ? typePool.Where(q => !explicitTeacherIds.Contains(q.CreatedById))
                    : typePool
            };

            var random = DeterministicSelector.CreateRandom(seed, type, bucket.Key);
            var bucketSelection = DeterministicSelector.TakeUnique(
                bucketPool,
                bucketCount,
                random,
                selectedIds,
                q => q.Id);

            foreach (var question in bucketSelection)
            {
                selectedIds.Add(question.Id);
            }

            selected.AddRange(bucketSelection);
        }

        return selected;
    }

    private static IReadOnlyList<QuestionPoolShortfall> ValidatePool(
        IReadOnlyList<Question> pool,
        IReadOnlyDictionary<QuestionType, int> typeCounts,
        IReadOnlyList<TeacherShare>? teacherDistribution)
    {
        var shortfalls = new List<QuestionPoolShortfall>();

        foreach (var (type, required) in typeCounts)
        {
            if (required == 0)
            {
                continue;
            }

            var typePool = pool.Where(q => q.Type == type).ToList();
            if (typePool.Count < required)
            {
                shortfalls.Add(new QuestionPoolShortfall(
                    type,
                    required,
                    typePool.Count,
                    null,
                    "All teachers"));
                continue;
            }

            if (teacherDistribution is null || teacherDistribution.Count == 0)
            {
                continue;
            }

            var teacherCounts = PercentageAllocator.Allocate(
                required,
                teacherDistribution.ToDictionary(
                    share => TeacherBucketKey(share.TeacherId),
                    share => share.Percentage));

            var explicitTeacherIds = teacherDistribution
                .Where(share => share.TeacherId.HasValue)
                .Select(share => share.TeacherId!.Value)
                .ToHashSet();

            foreach (var bucket in teacherCounts)
            {
                var bucketRequired = bucket.Value;
                if (bucketRequired == 0)
                {
                    continue;
                }

                var bucketTeacherId = ParseTeacherBucketKey(bucket.Key);
                var available = bucketTeacherId switch
                {
                    null when explicitTeacherIds.Count > 0 =>
                        typePool.Count(q => !explicitTeacherIds.Contains(q.CreatedById)),
                    null => typePool.Count,
                    var teacherId => typePool.Count(q => q.CreatedById == teacherId)
                };

                if (available < bucketRequired)
                {
                    shortfalls.Add(new QuestionPoolShortfall(
                        type,
                        bucketRequired,
                        available,
                        bucketTeacherId,
                        bucketTeacherId?.ToString() ?? "Other teachers"));
                }
            }
        }

        return shortfalls;
    }

    private static void ValidateCriteria(PaperGenerationCriteria criteria)
    {
        if (criteria.TotalQuestions < DomainConstraints.MinQuestionCount
            || criteria.TotalQuestions > DomainConstraints.MaxQuestionCount)
        {
            throw new DomainException(
                $"Total questions must be between {DomainConstraints.MinQuestionCount} " +
                $"and {DomainConstraints.MaxQuestionCount}.");
        }

        if (criteria.TypePercentages.Count == 0)
        {
            throw new DomainException("At least one question type percentage is required.");
        }

        foreach (var (type, percentage) in criteria.TypePercentages)
        {
            if (!Enum.IsDefined(type))
            {
                throw new DomainException($"Question type '{type}' is invalid.");
            }

            if (percentage <= 0)
            {
                throw new DomainException($"Percentage for {type} must be greater than zero.");
            }
        }

        var totalPercentage = criteria.TypePercentages.Values.Sum();
        if (totalPercentage != 100m)
        {
            throw new DomainException(
                $"Type percentages must sum to 100. Current sum is {totalPercentage}.");
        }

        if (criteria.TeacherDistribution is { Count: > 0 })
        {
            foreach (var share in criteria.TeacherDistribution)
            {
                if (share.Percentage <= 0)
                {
                    throw new DomainException("Teacher percentages must be greater than zero.");
                }
            }

            var teacherTotal = criteria.TeacherDistribution.Sum(share => share.Percentage);
            if (teacherTotal != 100m)
            {
                throw new DomainException(
                    $"Teacher percentages must sum to 100. Current sum is {teacherTotal}.");
            }
        }
    }

    private static int ComputeDefaultSeed(PaperGenerationCriteria criteria)
    {
        var hash = new HashCode();
        hash.Add(criteria.SubjectId);
        hash.Add(criteria.TotalQuestions);

        foreach (var entry in criteria.TypePercentages.OrderBy(kvp => (int)kvp.Key))
        {
            hash.Add(entry.Key);
            hash.Add(entry.Value);
        }

        if (criteria.TeacherDistribution is not null)
        {
            foreach (var share in criteria.TeacherDistribution.OrderBy(s => s.TeacherId?.ToString() ?? "others"))
            {
                hash.Add(share.TeacherId);
                hash.Add(share.Percentage);
            }
        }

        return hash.ToHashCode();
    }

    private static string TeacherBucketKey(Guid? teacherId) =>
        teacherId?.ToString() ?? "__others__";

    private static Guid? ParseTeacherBucketKey(string bucketKey) =>
        bucketKey == "__others__" ? null : Guid.Parse(bucketKey);

    private static string BuildShortfallMessage(IReadOnlyList<QuestionPoolShortfall> shortfalls)
    {
        var details = string.Join(
            "; ",
            shortfalls.Select(s =>
                $"{s.Type}/{s.TeacherLabel}: need {s.Required}, have {s.Available}"));

        return $"Insufficient questions in the bank to generate this paper. {details}";
    }
}
