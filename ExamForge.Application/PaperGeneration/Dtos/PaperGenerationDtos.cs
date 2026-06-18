using ExamForge.Domain.Enums;

namespace ExamForge.Application.PaperGeneration.Dtos;

public sealed class TypeDistributionItemDto
{
    public QuestionType Type { get; init; }
    public decimal Percentage { get; init; }
}

public sealed class TeacherDistributionItemDto
{
    /// <summary>
    /// Teacher to source questions from. Use null for the "other teachers" pool.
    /// </summary>
    public Guid? TeacherId { get; init; }

    public decimal Percentage { get; init; }
}

public sealed class GeneratePaperRequestDto
{
    public Guid SubjectId { get; init; }
    public int TotalQuestions { get; init; }
    public IReadOnlyList<TypeDistributionItemDto> TypeDistribution { get; init; } = [];
    public IReadOnlyList<TeacherDistributionItemDto>? TeacherDistribution { get; init; }

    /// <summary>
    /// Optional seed for reproducible shuffling. When omitted, a deterministic seed is derived from the request.
    /// </summary>
    public int? Seed { get; init; }
}

public sealed class McqOptionsDto
{
    public string OptionA { get; init; } = null!;
    public string OptionB { get; init; } = null!;
    public string OptionC { get; init; } = null!;
    public string OptionD { get; init; } = null!;
    public string CorrectOption { get; init; } = null!;
}

public sealed class GeneratedQuestionDto
{
    public Guid Id { get; init; }
    public Guid CreatedById { get; init; }
    public string CreatedByName { get; init; } = null!;
    public QuestionType Type { get; init; }
    public string Text { get; init; } = null!;
    public decimal Marks { get; init; }
    public McqOptionsDto? McqOptions { get; init; }
    public bool? TrueFalseAnswer { get; init; }
    public IReadOnlyList<string> BlankAnswers { get; init; } = [];
    public string? ModelAnswer { get; init; }
}

public sealed class GeneratedPaperSectionDto
{
    public QuestionType Type { get; init; }
    public int RequestedCount { get; init; }
    public int SelectedCount { get; init; }
    public decimal SectionMarks { get; init; }
    public IReadOnlyList<GeneratedQuestionDto> Questions { get; init; } = [];
}

public sealed class QuestionShortfallDto
{
    public QuestionType Type { get; init; }
    public int Required { get; init; }
    public int Available { get; init; }
    public Guid? TeacherId { get; init; }
    public string TeacherLabel { get; init; } = null!;
}

public sealed class GeneratePaperResponseDto
{
    public Guid SubjectId { get; init; }
    public string SubjectName { get; init; } = null!;
    public int Seed { get; init; }
    public int TotalQuestions { get; init; }
    public decimal TotalMarks { get; init; }
    public IReadOnlyList<GeneratedPaperSectionDto> Sections { get; init; } = [];
}

public sealed class InsufficientQuestionsErrorDto
{
    public string Message { get; init; } = null!;
    public IReadOnlyList<QuestionShortfallDto> Shortfalls { get; init; } = [];
}
