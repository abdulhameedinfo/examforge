using ExamForge.Domain.Common;
using ExamForge.Domain.Enums;
using ExamForge.Domain.Exceptions;
using ExamForge.Domain.ValueObjects;

namespace ExamForge.Domain.Entities;

public sealed class ExamPaperQuestion : BaseEntity
{
    public Guid ExamPaperId { get; private set; }
    public short Position { get; private set; }
    public Guid? SourceQuestionId { get; private set; }
    public long? SourceQuestionVersion { get; private set; }

    public QuestionType Type { get; private set; }
    public string Text { get; private set; } = null!;
    public decimal Marks { get; private set; }

    public string? McqOptionA { get; private set; }
    public string? McqOptionB { get; private set; }
    public string? McqOptionC { get; private set; }
    public string? McqOptionD { get; private set; }
    public McqCorrectOption? McqCorrect { get; private set; }
    public bool? TrueFalseAnswer { get; private set; }
    public string? ModelAnswer { get; private set; }
    public IReadOnlyList<string> BlankAnswers { get; private set; } = [];

    public ExamPaper ExamPaper { get; private set; } = null!;
    public Question? SourceQuestion { get; private set; }

    private ExamPaperQuestion()
    {
    }

    public static ExamPaperQuestion FromQuestion(Question question, short position)
    {
        if (!question.IsActive || question.IsDeleted)
        {
            throw new DomainException("Inactive or deleted questions cannot be added to an exam paper.");
        }

        var snapshot = new ExamPaperQuestion
        {
            Position = position,
            SourceQuestionId = question.Id,
            SourceQuestionVersion = question.Version,
            Type = question.Type,
            Text = question.Text,
            Marks = question.Marks,
            TrueFalseAnswer = question.TrueFalseAnswer,
            ModelAnswer = question.ModelAnswer,
            BlankAnswers = question.BlankAnswers.Select(a => a.Answer).ToList(),
            CreatedAt = DateTimeOffset.UtcNow,
            UpdatedAt = DateTimeOffset.UtcNow,
            SourceQuestion = question
        };

        if (question.McqOptions is not null)
        {
            snapshot.McqOptionA = question.McqOptions.OptionA;
            snapshot.McqOptionB = question.McqOptions.OptionB;
            snapshot.McqOptionC = question.McqOptions.OptionC;
            snapshot.McqOptionD = question.McqOptions.OptionD;
            snapshot.McqCorrect = question.McqOptions.CorrectOption;
        }

        return snapshot;
    }

    internal void AssignToPaper(ExamPaper paper, short position)
    {
        ExamPaper = paper;
        Position = position;
    }
}
