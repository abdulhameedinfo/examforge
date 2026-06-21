using ExamForge.Application.PaperGeneration.Dtos;

namespace ExamForge.Application.PaperGeneration.Pdf;

public sealed class PaperPdfSectionModel
{
    public string Title { get; init; } = null!;
    public IReadOnlyList<GeneratedQuestionDto> Questions { get; init; } = [];
}

public sealed class PaperPdfModel
{
    public Guid SubjectId { get; init; }
    public string SubjectName { get; init; } = null!;
    public DateTimeOffset GeneratedAt { get; init; }
    public decimal TotalMarks { get; init; }
    public IReadOnlyList<PaperPdfSectionModel> Sections { get; init; } = [];
}

