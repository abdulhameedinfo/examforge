using ExamForge.Domain.Common;
using ExamForge.Domain.Exceptions;

namespace ExamForge.Domain.Entities;

/// <summary>
/// Academic subject that groups questions and paper templates.
/// </summary>
public sealed class Subject : BaseEntity
{
    private readonly List<Question> _questions = [];
    private readonly List<PaperTemplate> _paperTemplates = [];

    public string Name { get; private set; } = null!;
    public string Code { get; private set; } = null!;
    public string? Description { get; private set; }
    public bool IsActive { get; private set; } = true;

    public IReadOnlyCollection<Question> Questions => _questions.AsReadOnly();
    public IReadOnlyCollection<PaperTemplate> PaperTemplates => _paperTemplates.AsReadOnly();

    private Subject()
    {
    }

    public static Subject Create(string name, string code, string? description = null)
    {
        var subject = new Subject
        {
            Name = ValidateName(name),
            Code = ValidateCode(code),
            Description = ValidateDescription(description),
            CreatedAt = DateTimeOffset.UtcNow,
            UpdatedAt = DateTimeOffset.UtcNow
        };

        return subject;
    }

    public void Update(string name, string code, string? description = null)
    {
        Name = ValidateName(name);
        Code = ValidateCode(code);
        Description = ValidateDescription(description);
        Touch();
    }

    public void Deactivate()
    {
        IsActive = false;
        Touch();
    }

    public void Activate()
    {
        IsActive = true;
        Touch();
    }

    internal void RegisterQuestion(Question question) => _questions.Add(question);

    internal void RegisterPaperTemplate(PaperTemplate template) => _paperTemplates.Add(template);

    private static string ValidateName(string name)
    {
        if (string.IsNullOrWhiteSpace(name))
        {
            throw new DomainException("Subject name is required.");
        }

        var trimmed = name.Trim();
        if (trimmed.Length > DomainConstraints.MaxNameLength)
        {
            throw new DomainException(
                $"Subject name cannot exceed {DomainConstraints.MaxNameLength} characters.");
        }

        return trimmed;
    }

    private static string ValidateCode(string code)
    {
        if (string.IsNullOrWhiteSpace(code))
        {
            throw new DomainException("Subject code is required.");
        }

        var trimmed = code.Trim().ToUpperInvariant();
        if (trimmed.Length > DomainConstraints.MaxSubjectCodeLength)
        {
            throw new DomainException(
                $"Subject code cannot exceed {DomainConstraints.MaxSubjectCodeLength} characters.");
        }

        return trimmed;
    }

    private static string? ValidateDescription(string? description)
    {
        if (description is null)
        {
            return null;
        }

        var trimmed = description.Trim();
        if (trimmed.Length == 0)
        {
            return null;
        }

        if (trimmed.Length > DomainConstraints.MaxDescriptionLength)
        {
            throw new DomainException(
                $"Subject description cannot exceed {DomainConstraints.MaxDescriptionLength} characters.");
        }

        return trimmed;
    }

}
