using ExamForge.Domain.Enums;

namespace ExamForge.Application.Syncing;

public static class SyncEntityNames
{
    public const string Subject = "Subject";
    public const string Question = "Question";
}

public static class SyncOperations
{
    public const string Upsert = "upsert";
    public const string Delete = "delete";
}

public sealed record SubjectSyncPayload(
    Guid Id,
    string Name,
    string Code,
    string? Description,
    bool IsActive);

public sealed record McqOptionsSyncPayload(
    string OptionA,
    string OptionB,
    string OptionC,
    string OptionD,
    McqCorrectOption CorrectOption);

public sealed record QuestionBlankAnswerSyncPayload(
    Guid? Id,
    string Answer,
    short SortOrder);

public sealed record QuestionSyncPayload(
    Guid Id,
    Guid SubjectId,
    Guid CreatedById,
    QuestionType Type,
    string Text,
    decimal Marks,
    bool IsActive,
    string? ModelAnswer,
    bool? TrueFalseAnswer,
    McqOptionsSyncPayload? McqOptions,
    List<QuestionBlankAnswerSyncPayload> BlankAnswers);
