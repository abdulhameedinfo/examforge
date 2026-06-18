using ExamForge.Domain.Exceptions;

namespace ExamForge.Domain.PaperGeneration;

public sealed class InsufficientQuestionPoolException : DomainException
{
    public InsufficientQuestionPoolException(
        string message,
        IReadOnlyList<QuestionPoolShortfall> shortfalls)
        : base(message)
    {
        Shortfalls = shortfalls;
    }

    public IReadOnlyList<QuestionPoolShortfall> Shortfalls { get; }
}
