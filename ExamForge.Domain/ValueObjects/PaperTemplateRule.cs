using ExamForge.Domain.Common;
using ExamForge.Domain.Enums;
using ExamForge.Domain.Exceptions;

namespace ExamForge.Domain.ValueObjects;

public sealed class PaperTemplateRule : IEquatable<PaperTemplateRule>
{
    public QuestionType QuestionType { get; }
    public int QuestionCount { get; }
    public decimal MarksPerQuestion { get; }

    public decimal SectionTotalMarks => QuestionCount * MarksPerQuestion;

    public PaperTemplateRule(QuestionType questionType, int questionCount, decimal marksPerQuestion)
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

        QuestionType = questionType;
        QuestionCount = questionCount;
        MarksPerQuestion = marksPerQuestion;
    }

    public bool Equals(PaperTemplateRule? other)
    {
        if (other is null)
        {
            return false;
        }

        return QuestionType == other.QuestionType
               && QuestionCount == other.QuestionCount
               && MarksPerQuestion == other.MarksPerQuestion;
    }

    public override bool Equals(object? obj) => Equals(obj as PaperTemplateRule);

    public override int GetHashCode() =>
        HashCode.Combine(QuestionType, QuestionCount, MarksPerQuestion);
}
