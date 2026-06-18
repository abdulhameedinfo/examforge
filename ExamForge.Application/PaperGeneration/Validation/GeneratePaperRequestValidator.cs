using ExamForge.Application.PaperGeneration.Dtos;
using ExamForge.Domain.Common;
using ExamForge.Domain.Enums;
using FluentValidation;

namespace ExamForge.Application.PaperGeneration.Validation;

public sealed class GeneratePaperRequestValidator : AbstractValidator<GeneratePaperRequestDto>
{
    public GeneratePaperRequestValidator()
    {
        RuleFor(x => x.SubjectId)
            .NotEmpty();

        RuleFor(x => x.TotalQuestions)
            .InclusiveBetween(DomainConstraints.MinQuestionCount, DomainConstraints.MaxQuestionCount);

        RuleFor(x => x.TypeDistribution)
            .NotEmpty()
            .WithMessage("At least one question type percentage is required.");

        RuleFor(x => x.TypeDistribution)
            .Must(HaveUniqueTypes)
            .WithMessage("Each question type may appear only once in the distribution.");

        RuleForEach(x => x.TypeDistribution).ChildRules(type =>
        {
            type.RuleFor(x => x.Type)
                .Must(t => Enum.IsDefined(t))
                .WithMessage("Question type is invalid.");

            type.RuleFor(x => x.Percentage)
                .GreaterThan(0)
                .LessThanOrEqualTo(100);
        });

        RuleFor(x => x.TypeDistribution)
            .Must(distribution => distribution.Sum(item => item.Percentage) == 100m)
            .WithMessage("Type percentages must sum to exactly 100.");

        When(x => x.TeacherDistribution is { Count: > 0 }, () =>
        {
            RuleFor(x => x.TeacherDistribution!)
                .Must(HaveUniqueTeacherBuckets)
                .WithMessage("Each teacher bucket may appear only once in the distribution.");

            RuleForEach(x => x.TeacherDistribution!).ChildRules(teacher =>
            {
                teacher.RuleFor(x => x.Percentage)
                    .GreaterThan(0)
                    .LessThanOrEqualTo(100);
            });

            RuleFor(x => x.TeacherDistribution!)
                .Must(distribution => distribution!.Sum(item => item.Percentage) == 100m)
                .WithMessage("Teacher percentages must sum to exactly 100.");
        });
    }

    private static bool HaveUniqueTypes(IReadOnlyList<TypeDistributionItemDto> distribution) =>
        distribution.Select(item => item.Type).Distinct().Count() == distribution.Count;

    private static bool HaveUniqueTeacherBuckets(IReadOnlyList<TeacherDistributionItemDto> distribution) =>
        distribution.Select(item => item.TeacherId).Distinct().Count() == distribution.Count;
}
