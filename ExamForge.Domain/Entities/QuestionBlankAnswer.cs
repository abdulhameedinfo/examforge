using ExamForge.Domain.Common;
using ExamForge.Domain.Exceptions;

namespace ExamForge.Domain.Entities;

public sealed class QuestionBlankAnswer : BaseEntity
{
    public Guid QuestionId { get; private set; }
    public string Answer { get; private set; } = null!;
    public short SortOrder { get; private set; }

    public Question Question { get; private set; } = null!;

    private QuestionBlankAnswer()
    {
    }

    internal static QuestionBlankAnswer Create(Question question, string answer, short sortOrder)
    {
        var trimmed = answer.Trim();
        if (trimmed.Length == 0)
        {
            throw new DomainException("Blank answer text is required.");
        }

        if (trimmed.Length > DomainConstraints.MaxBlankAnswerLength)
        {
            throw new DomainException(
                $"Blank answers cannot exceed {DomainConstraints.MaxBlankAnswerLength} characters.");
        }

        return new QuestionBlankAnswer
        {
            Question = question,
            Answer = trimmed,
            SortOrder = sortOrder,
            CreatedAt = DateTimeOffset.UtcNow,
            UpdatedAt = DateTimeOffset.UtcNow
        };
    }
}
