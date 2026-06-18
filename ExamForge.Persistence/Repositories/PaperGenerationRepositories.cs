using ExamForge.Application.Abstractions;
using ExamForge.Domain.Entities;
using ExamForge.Persistence.Context;
using Microsoft.EntityFrameworkCore;

namespace ExamForge.Persistence.Repositories;

public sealed class QuestionPoolRepository : IQuestionPoolRepository
{
    private readonly ExamForgeDbContext _dbContext;

    public QuestionPoolRepository(ExamForgeDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<IReadOnlyList<Question>> GetActiveBySubjectAsync(
        Guid subjectId,
        CancellationToken cancellationToken = default)
    {
        return await _dbContext.Questions
            .AsNoTracking()
            .Include(question => question.CreatedBy)
            .Include(question => question.BlankAnswers)
            .Where(question =>
                question.SubjectId == subjectId
                && question.IsActive
                && !question.IsDeleted)
            .ToListAsync(cancellationToken);
    }
}

public sealed class SubjectReadRepository : ISubjectReadRepository
{
    private readonly ExamForgeDbContext _dbContext;

    public SubjectReadRepository(ExamForgeDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public Task<Subject?> GetByIdAsync(Guid subjectId, CancellationToken cancellationToken = default)
    {
        return _dbContext.Subjects
            .AsNoTracking()
            .FirstOrDefaultAsync(subject => subject.Id == subjectId, cancellationToken);
    }
}
