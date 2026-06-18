using ExamForge.Domain.Common;
using ExamForge.Domain.Enums;
using ExamForge.Domain.Exceptions;

namespace ExamForge.Domain.Entities;

/// <summary>
/// Represents a system user with Teacher or Admin privileges.
/// Teachers create and manage questions; Admins manage subjects and templates.
/// </summary>
public sealed class User : BaseEntity
{
    private readonly List<Question> _createdQuestions = [];
    private readonly List<PaperTemplate> _createdPaperTemplates = [];

    public string Email { get; private set; } = null!;
    public string FullName { get; private set; } = null!;
    public UserRole Role { get; private set; }
    public bool IsActive { get; private set; } = true;

    public IReadOnlyCollection<Question> CreatedQuestions => _createdQuestions.AsReadOnly();
    public IReadOnlyCollection<PaperTemplate> CreatedPaperTemplates => _createdPaperTemplates.AsReadOnly();

    private User()
    {
    }

    public static User Create(string email, string fullName, UserRole role)
    {
        var user = new User
        {
            Email = ValidateEmail(email),
            FullName = ValidateFullName(fullName),
            Role = ValidateRole(role),
            CreatedAt = DateTimeOffset.UtcNow,
            UpdatedAt = DateTimeOffset.UtcNow
        };

        return user;
    }

    public void UpdateProfile(string fullName)
    {
        FullName = ValidateFullName(fullName);
        Touch();
    }

    public void ChangeRole(UserRole role)
    {
        Role = ValidateRole(role);
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

    public bool CanManageSubjects() => Role == UserRole.Admin;

    public bool CanManagePaperTemplates() => Role is UserRole.Admin or UserRole.Teacher;

    internal void RegisterCreatedQuestion(Question question) => _createdQuestions.Add(question);

    internal void RegisterCreatedPaperTemplate(PaperTemplate template) =>
        _createdPaperTemplates.Add(template);

    private static string ValidateEmail(string email)
    {
        if (string.IsNullOrWhiteSpace(email))
        {
            throw new DomainException("Email is required.");
        }

        var trimmed = email.Trim();
        if (trimmed.Length > DomainConstraints.MaxEmailLength)
        {
            throw new DomainException(
                $"Email cannot exceed {DomainConstraints.MaxEmailLength} characters.");
        }

        if (!trimmed.Contains('@'))
        {
            throw new DomainException("Email must be a valid email address.");
        }

        return trimmed.ToLowerInvariant();
    }

    private static string ValidateFullName(string fullName)
    {
        if (string.IsNullOrWhiteSpace(fullName))
        {
            throw new DomainException("Full name is required.");
        }

        var trimmed = fullName.Trim();
        if (trimmed.Length > DomainConstraints.MaxNameLength)
        {
            throw new DomainException(
                $"Full name cannot exceed {DomainConstraints.MaxNameLength} characters.");
        }

        return trimmed;
    }

    private static UserRole ValidateRole(UserRole role)
    {
        if (!Enum.IsDefined(role))
        {
            throw new DomainException("User role is invalid.");
        }

        return role;
    }

}
