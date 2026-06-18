using ExamForge.Domain.Common;
using ExamForge.Domain.Exceptions;

namespace ExamForge.Domain.Entities;

public sealed class ExamPaper : BaseEntity
{
    private readonly List<ExamPaperQuestion> _questions = [];

    public Guid SubjectId { get; private set; }
    public Guid PaperTemplateId { get; private set; }
    public Guid GeneratedById { get; private set; }
    public string Title { get; private set; } = null!;
    public decimal TotalMarks { get; private set; }
    public int DurationMinutes { get; private set; }
    public DateTimeOffset GeneratedAt { get; private set; }

    public Subject Subject { get; private set; } = null!;
    public PaperTemplate PaperTemplate { get; private set; } = null!;
    public User GeneratedBy { get; private set; } = null!;
    public IReadOnlyCollection<ExamPaperQuestion> Questions => _questions.AsReadOnly();

    private ExamPaper()
    {
    }

    public static ExamPaper Create(
        Subject subject,
        PaperTemplate template,
        User generatedBy,
        string title,
        int durationMinutes,
        IEnumerable<ExamPaperQuestion> questions)
    {
        if (!generatedBy.CanManageSubjects())
        {
            throw new DomainException("Only admins can generate exam papers.");
        }

        if (!generatedBy.IsActive)
        {
            throw new DomainException("Inactive users cannot generate exam papers.");
        }

        if (!subject.IsActive)
        {
            throw new DomainException("Exam papers cannot be generated for an inactive subject.");
        }

        if (!template.IsActive || template.SubjectId != subject.Id)
        {
            throw new DomainException("Paper template is invalid for this subject.");
        }

        var questionList = questions?.ToList()
            ?? throw new DomainException("Exam paper questions are required.");

        if (questionList.Count == 0)
        {
            throw new DomainException("An exam paper must contain at least one question.");
        }

        var paper = new ExamPaper
        {
            SubjectId = subject.Id,
            PaperTemplateId = template.Id,
            GeneratedById = generatedBy.Id,
            Title = ValidateTitle(title),
            DurationMinutes = ValidateDuration(durationMinutes),
            GeneratedAt = DateTimeOffset.UtcNow,
            CreatedAt = DateTimeOffset.UtcNow,
            UpdatedAt = DateTimeOffset.UtcNow,
            Subject = subject,
            PaperTemplate = template,
            GeneratedBy = generatedBy
        };

        for (var i = 0; i < questionList.Count; i++)
        {
            var question = questionList[i];
            question.AssignToPaper(paper, (short)(i + 1));
            paper._questions.Add(question);
        }

        paper.TotalMarks = paper._questions.Sum(q => q.Marks);
        return paper;
    }

    private static string ValidateTitle(string title)
    {
        if (string.IsNullOrWhiteSpace(title))
        {
            throw new DomainException("Exam paper title is required.");
        }

        var trimmed = title.Trim();
        if (trimmed.Length > DomainConstraints.MaxPaperTemplateNameLength)
        {
            throw new DomainException(
                $"Exam paper title cannot exceed {DomainConstraints.MaxPaperTemplateNameLength} characters.");
        }

        return trimmed;
    }

    private static int ValidateDuration(int durationMinutes)
    {
        if (durationMinutes < DomainConstraints.MinExamDurationMinutes
            || durationMinutes > DomainConstraints.MaxExamDurationMinutes)
        {
            throw new DomainException(
                $"Exam duration must be between {DomainConstraints.MinExamDurationMinutes} " +
                $"and {DomainConstraints.MaxExamDurationMinutes} minutes.");
        }

        return durationMinutes;
    }
}
