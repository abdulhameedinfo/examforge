using ExamForge.Domain.Entities;
using ExamForge.Domain.Enums;

namespace ExamForge.Domain.PaperGeneration;

public sealed record TeacherShare(Guid? TeacherId, decimal Percentage);

public sealed class PaperGenerationCriteria
{
    public required Guid SubjectId { get; init; }
    public required int TotalQuestions { get; init; }
    public required IReadOnlyDictionary<QuestionType, decimal> TypePercentages { get; init; }
    public IReadOnlyList<TeacherShare>? TeacherDistribution { get; init; }
    public int? Seed { get; init; }
}

public sealed class GeneratedPaperSection
{
    public required QuestionType Type { get; init; }
    public required int RequestedCount { get; init; }
    public required IReadOnlyList<Question> Questions { get; init; }
}

public sealed class GeneratedPaperResult
{
    public required Guid SubjectId { get; init; }
    public required int Seed { get; init; }
    public required int TotalQuestions { get; init; }
    public required decimal TotalMarks { get; init; }
    public required IReadOnlyList<GeneratedPaperSection> Sections { get; init; }
}

public sealed record QuestionPoolShortfall(
    QuestionType Type,
    int Required,
    int Available,
    Guid? TeacherId,
    string TeacherLabel);
