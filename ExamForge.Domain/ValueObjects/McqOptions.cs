using ExamForge.Domain.Common;
using ExamForge.Domain.Exceptions;

namespace ExamForge.Domain.ValueObjects;

public sealed class McqOptions : IEquatable<McqOptions>
{
    public string OptionA { get; }
    public string OptionB { get; }
    public string OptionC { get; }
    public string OptionD { get; }
    public McqCorrectOption CorrectOption { get; }

    public McqOptions(
        string optionA,
        string optionB,
        string optionC,
        string optionD,
        McqCorrectOption correctOption)
    {
        OptionA = ValidateOption(optionA, nameof(optionA));
        OptionB = ValidateOption(optionB, nameof(optionB));
        OptionC = ValidateOption(optionC, nameof(optionC));
        OptionD = ValidateOption(optionD, nameof(optionD));
        CorrectOption = correctOption;
    }

    private static string ValidateOption(string value, string paramName)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            throw new DomainException($"{paramName} is required for MCQ questions.");
        }

        var trimmed = value.Trim();
        if (trimmed.Length > DomainConstraints.MaxOptionTextLength)
        {
            throw new DomainException(
                $"{paramName} cannot exceed {DomainConstraints.MaxOptionTextLength} characters.");
        }

        return trimmed;
    }

    public bool Equals(McqOptions? other)
    {
        if (other is null)
        {
            return false;
        }

        return OptionA == other.OptionA
               && OptionB == other.OptionB
               && OptionC == other.OptionC
               && OptionD == other.OptionD
               && CorrectOption == other.CorrectOption;
    }

    public override bool Equals(object? obj) => Equals(obj as McqOptions);

    public override int GetHashCode() =>
        HashCode.Combine(OptionA, OptionB, OptionC, OptionD, CorrectOption);
}

public enum McqCorrectOption
{
    A = 1,
    B = 2,
    C = 3,
    D = 4
}
