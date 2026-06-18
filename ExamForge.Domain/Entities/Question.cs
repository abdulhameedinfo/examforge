using ExamForge.Domain.Common;
using ExamForge.Domain.Enums;
using ExamForge.Domain.Exceptions;
using ExamForge.Domain.ValueObjects;

namespace ExamForge.Domain.Entities;

/// <summary>
/// A question in the bank. Type-specific answer data is stored in dedicated fields
/// and enforced at creation/update time.
/// </summary>
public sealed class Question : BaseEntity
{
    private readonly List<QuestionBlankAnswer> _blankAnswers = [];

    public Guid SubjectId { get; private set; }
    public Guid CreatedById { get; private set; }
    public QuestionType Type { get; private set; }
    public string Text { get; private set; } = null!;
    public decimal Marks { get; private set; }
    public bool IsActive { get; private set; } = true;

    // MCQ (options A, B, C, D)
    public McqOptions? McqOptions { get; private set; }

    // True/False
    public bool? TrueFalseAnswer { get; private set; }

    // Fill in the blank — one or more acceptable answers
    public IReadOnlyCollection<QuestionBlankAnswer> BlankAnswers => _blankAnswers.AsReadOnly();

    // Short / Long question — optional model answer for marking guidance
    public string? ModelAnswer { get; private set; }

    public Subject Subject { get; private set; } = null!;
    public User CreatedBy { get; private set; } = null!;

    private Question()
    {
    }

    public static Question CreateMultipleChoice(
        Subject subject,
        User createdBy,
        string text,
        decimal marks,
        McqOptions options)
    {
        EnsureCreatorCanManageQuestions(createdBy);
        EnsureSubjectIsActive(subject);

        var question = CreateBase(subject, createdBy, QuestionType.MultipleChoice, text, marks);
        question.McqOptions = options ?? throw new DomainException("MCQ options are required.");
        question.RegisterWith(subject, createdBy);
        return question;
    }

    public static Question CreateTrueFalse(
        Subject subject,
        User createdBy,
        string text,
        decimal marks,
        bool correctAnswer)
    {
        EnsureCreatorCanManageQuestions(createdBy);
        EnsureSubjectIsActive(subject);

        var question = CreateBase(subject, createdBy, QuestionType.TrueFalse, text, marks);
        question.TrueFalseAnswer = correctAnswer;
        question.RegisterWith(subject, createdBy);
        return question;
    }

    public static Question CreateFillInTheBlank(
        Subject subject,
        User createdBy,
        string text,
        decimal marks,
        IEnumerable<string> acceptableAnswers)
    {
        EnsureCreatorCanManageQuestions(createdBy);
        EnsureSubjectIsActive(subject);

        var question = CreateBase(subject, createdBy, QuestionType.FillInTheBlank, text, marks);
        var answers = ValidateBlankAnswers(acceptableAnswers);
        for (short i = 0; i < answers.Count; i++)
        {
            question._blankAnswers.Add(QuestionBlankAnswer.Create(question, answers[i], i));
        }

        question.RegisterWith(subject, createdBy);
        return question;
    }

    public static Question CreateShortQuestion(
        Subject subject,
        User createdBy,
        string text,
        decimal marks,
        string? modelAnswer = null)
    {
        EnsureCreatorCanManageQuestions(createdBy);
        EnsureSubjectIsActive(subject);

        var question = CreateBase(subject, createdBy, QuestionType.ShortQuestion, text, marks);
        question.ModelAnswer = ValidateModelAnswer(modelAnswer);
        question.RegisterWith(subject, createdBy);
        return question;
    }

    public static Question CreateLongQuestion(
        Subject subject,
        User createdBy,
        string text,
        decimal marks,
        string? modelAnswer = null)
    {
        EnsureCreatorCanManageQuestions(createdBy);
        EnsureSubjectIsActive(subject);

        var question = CreateBase(subject, createdBy, QuestionType.LongQuestion, text, marks);
        question.ModelAnswer = ValidateModelAnswer(modelAnswer);
        question.RegisterWith(subject, createdBy);
        return question;
    }

    public void UpdateText(string text)
    {
        Text = ValidateText(text);
        Touch();
    }

    public void UpdateMarks(decimal marks)
    {
        Marks = ValidateMarks(marks);
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

    private static Question CreateBase(
        Subject subject,
        User createdBy,
        QuestionType type,
        string text,
        decimal marks)
    {
        if (!Enum.IsDefined(type))
        {
            throw new DomainException("Question type is invalid.");
        }

        return new Question
        {
            SubjectId = subject.Id,
            CreatedById = createdBy.Id,
            Type = type,
            Text = ValidateText(text),
            Marks = ValidateMarks(marks),
            CreatedAt = DateTimeOffset.UtcNow,
            UpdatedAt = DateTimeOffset.UtcNow
        };
    }

    private void RegisterWith(Subject subject, User createdBy)
    {
        Subject = subject;
        CreatedBy = createdBy;
        subject.RegisterQuestion(this);
        createdBy.RegisterCreatedQuestion(this);
    }

    private static void EnsureCreatorCanManageQuestions(User createdBy)
    {
        if (!createdBy.IsActive)
        {
            throw new DomainException("Inactive users cannot create questions.");
        }

        if (createdBy.Role is not (UserRole.Teacher or UserRole.Admin))
        {
            throw new DomainException("Only teachers and admins can create questions.");
        }
    }

    private static void EnsureSubjectIsActive(Subject subject)
    {
        if (!subject.IsActive)
        {
            throw new DomainException("Questions cannot be added to an inactive subject.");
        }
    }

    private static string ValidateText(string text)
    {
        if (string.IsNullOrWhiteSpace(text))
        {
            throw new DomainException("Question text is required.");
        }

        var trimmed = text.Trim();
        if (trimmed.Length > DomainConstraints.MaxQuestionTextLength)
        {
            throw new DomainException(
                $"Question text cannot exceed {DomainConstraints.MaxQuestionTextLength} characters.");
        }

        return trimmed;
    }

    private static decimal ValidateMarks(decimal marks)
    {
        if (marks < DomainConstraints.MinMarks || marks > DomainConstraints.MaxMarks)
        {
            throw new DomainException(
                $"Marks must be between {DomainConstraints.MinMarks} and {DomainConstraints.MaxMarks}.");
        }

        return marks;
    }

    private static string? ValidateModelAnswer(string? modelAnswer)
    {
        if (modelAnswer is null)
        {
            return null;
        }

        var trimmed = modelAnswer.Trim();
        if (trimmed.Length == 0)
        {
            return null;
        }

        if (trimmed.Length > DomainConstraints.MaxModelAnswerLength)
        {
            throw new DomainException(
                $"Model answer cannot exceed {DomainConstraints.MaxModelAnswerLength} characters.");
        }

        return trimmed;
    }

    private static IReadOnlyList<string> ValidateBlankAnswers(IEnumerable<string> acceptableAnswers)
    {
        var answers = acceptableAnswers
            .Select(a => a?.Trim())
            .Where(a => !string.IsNullOrWhiteSpace(a))
            .Select(a => a!)
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .ToList();

        if (answers.Count == 0)
        {
            throw new DomainException("At least one acceptable blank answer is required.");
        }

        foreach (var answer in answers)
        {
            if (answer.Length > DomainConstraints.MaxBlankAnswerLength)
            {
                throw new DomainException(
                    $"Blank answers cannot exceed {DomainConstraints.MaxBlankAnswerLength} characters.");
            }
        }

        return answers;
    }

}
