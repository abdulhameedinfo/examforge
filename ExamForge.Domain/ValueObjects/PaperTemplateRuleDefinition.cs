using ExamForge.Domain.Enums;

namespace ExamForge.Domain.ValueObjects;

public sealed record PaperTemplateRuleDefinition(
    QuestionType QuestionType,
    int QuestionCount,
    decimal MarksPerQuestion);
