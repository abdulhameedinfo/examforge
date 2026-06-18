using ExamForge.Domain.Entities;

namespace ExamForge.Application.Abstractions;

public interface IQuestionPoolRepository
{
    Task<IReadOnlyList<Question>> GetActiveBySubjectAsync(
        Guid subjectId,
        CancellationToken cancellationToken = default);
}

public interface ISubjectReadRepository
{
    Task<Subject?> GetByIdAsync(Guid subjectId, CancellationToken cancellationToken = default);
}
