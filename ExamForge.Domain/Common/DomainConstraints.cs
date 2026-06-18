namespace ExamForge.Domain.Common;

public static class DomainConstraints
{
    public const int MaxNameLength = 200;
    public const int MaxEmailLength = 256;
    public const int MaxSubjectCodeLength = 20;
    public const int MaxDescriptionLength = 1000;
    public const int MaxQuestionTextLength = 4000;
    public const int MaxOptionTextLength = 1000;
    public const int MaxModelAnswerLength = 8000;
    public const int MaxBlankAnswerLength = 500;
    public const int MaxPaperTemplateNameLength = 200;
    public const int MinMarks = 1;
    public const int MaxMarks = 100;
    public const int MinQuestionCount = 1;
    public const int MaxQuestionCount = 200;
    public const int MinExamDurationMinutes = 15;
    public const int MaxExamDurationMinutes = 480;
}
