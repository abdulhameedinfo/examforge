using ExamForge.Domain.Common;
using ExamForge.Domain.Enums;
using ExamForge.Domain.Exceptions;

namespace ExamForge.Domain.Entities;

public sealed class PaperTemplateRule : BaseEntity
{
    public Guid PaperTemplateId { get; private set; }
    public QuestionType QuestionType { get; private set; }
    public int QuestionCount { get; private set; }
    public decimal MarksPerQuestion { get; private set; }

    public decimal SectionTotalMarks => QuestionCount * MarksPerQuestion;

    public PaperTemplate PaperTemplate { get; private set; } = null!;

    private PaperTemplateRule()
    {
    }

    internal static PaperTemplateRule Create(
        PaperTemplate template,
        QuestionType questionType,
        int questionCount,
        decimal marksPerQuestion)
    {
        if (!Enum.IsDefined(questionType))
        {
            throw new DomainException("Question type is invalid.");
        }

        if (questionCount < DomainConstraints.MinQuestionCount
            || questionCount > DomainConstraints.MaxQuestionCount)
        {
            throw new DomainException(
                $"Question count must be between {DomainConstraints.MinQuestionCount} " +
                $"and {DomainConstraints.MaxQuestionCount}.");
        }

        if (marksPerQuestion < DomainConstraints.MinMarks
            || marksPerQuestion > DomainConstraints.MaxMarks)
        {
            throw new DomainException(
                $"Marks per question must be between {DomainConstraints.MinMarks} " +
                $"and {DomainConstraints.MaxMarks}.");
        }

        return new PaperTemplateRule
        {
            PaperTemplate = template,
            QuestionType = questionType,
            QuestionCount = questionCount,
            MarksPerQuestion = marksPerQuestion,
            CreatedAt = DateTimeOffset.UtcNow,
            UpdatedAt = DateTimeOffset.UtcNow
        };
    }
}
