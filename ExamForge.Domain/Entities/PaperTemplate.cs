using ExamForge.Domain.Common;
using ExamForge.Domain.Enums;
using ExamForge.Domain.Exceptions;
namespace ExamForge.Domain.Entities;

/// <summary>
/// Defines rules for generating an exam paper from the question bank for a subject.
/// Each rule specifies how many questions of a given type to include and their marks.
/// </summary>
public sealed class PaperTemplate : BaseEntity
{
    private readonly List<PaperTemplateRule> _rules = [];

    public Guid SubjectId { get; private set; }
    public Guid CreatedById { get; private set; }
    public string Name { get; private set; } = null!;
    public string? Description { get; private set; }
    public int DurationMinutes { get; private set; }
    public bool IsActive { get; private set; } = true;

    public IReadOnlyCollection<PaperTemplateRule> Rules => _rules.AsReadOnly();
    public decimal TotalMarks => _rules.Sum(r => r.SectionTotalMarks);
    public int TotalQuestionCount => _rules.Sum(r => r.QuestionCount);

    public Subject Subject { get; private set; } = null!;
    public User CreatedBy { get; private set; } = null!;

    private PaperTemplate()
    {
    }

    public static PaperTemplate Create(
        Subject subject,
        User createdBy,
        string name,
        int durationMinutes,
        IEnumerable<PaperTemplateRuleDefinition> rules,
        string? description = null)
    {
        EnsureCreatorCanManageTemplates(createdBy);
        EnsureSubjectIsActive(subject);

        var template = new PaperTemplate
        {
            SubjectId = subject.Id,
            CreatedById = createdBy.Id,
            Name = ValidateName(name),
            Description = ValidateDescription(description),
            DurationMinutes = ValidateDuration(durationMinutes),
            CreatedAt = DateTimeOffset.UtcNow,
            UpdatedAt = DateTimeOffset.UtcNow,
            Subject = subject,
            CreatedBy = createdBy
        };

        template.SetRules(rules);
        subject.RegisterPaperTemplate(template);
        createdBy.RegisterCreatedPaperTemplate(template);
        return template;
    }

    public void Update(string name, int durationMinutes, string? description = null)
    {
        Name = ValidateName(name);
        Description = ValidateDescription(description);
        DurationMinutes = ValidateDuration(durationMinutes);
        Touch();
    }

    public void ReplaceRules(IEnumerable<PaperTemplateRuleDefinition> rules)
    {
        SetRules(rules);
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

    public int GetRequiredCountFor(QuestionType questionType) =>
        _rules.Where(r => r.QuestionType == questionType).Sum(r => r.QuestionCount);

    private void SetRules(IEnumerable<PaperTemplateRuleDefinition> rules)
    {
        var ruleList = rules?.ToList() ?? throw new DomainException("Paper template rules are required.");

        if (ruleList.Count == 0)
        {
            throw new DomainException("A paper template must contain at least one rule.");
        }

        var duplicateTypes = ruleList
            .GroupBy(r => r.QuestionType)
            .Where(g => g.Count() > 1)
            .Select(g => g.Key)
            .ToList();

        if (duplicateTypes.Count > 0)
        {
            throw new DomainException(
                "Each question type may appear only once in a paper template.");
        }

        _rules.Clear();
        foreach (var rule in ruleList)
        {
            _rules.Add(PaperTemplateRule.Create(
                this,
                rule.QuestionType,
                rule.QuestionCount,
                rule.MarksPerQuestion));
        }
    }

    private static void EnsureCreatorCanManageTemplates(User createdBy)
    {
        if (!createdBy.IsActive)
        {
            throw new DomainException("Inactive users cannot create paper templates.");
        }

        if (!createdBy.CanManagePaperTemplates())
        {
            throw new DomainException("Only teachers and admins can create paper templates.");
        }
    }

    private static void EnsureSubjectIsActive(Subject subject)
    {
        if (!subject.IsActive)
        {
            throw new DomainException("Paper templates cannot be created for an inactive subject.");
        }
    }

    private static string ValidateName(string name)
    {
        if (string.IsNullOrWhiteSpace(name))
        {
            throw new DomainException("Paper template name is required.");
        }

        var trimmed = name.Trim();
        if (trimmed.Length > DomainConstraints.MaxPaperTemplateNameLength)
        {
            throw new DomainException(
                $"Paper template name cannot exceed {DomainConstraints.MaxPaperTemplateNameLength} characters.");
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
                $"Paper template description cannot exceed {DomainConstraints.MaxDescriptionLength} characters.");
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
