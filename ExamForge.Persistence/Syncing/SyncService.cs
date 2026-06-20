using System.Reflection;
using System.Text.Json;
using ExamForge.Application.Abstractions;
using ExamForge.Application.Syncing;
using ExamForge.Domain.Common;
using ExamForge.Domain.Entities;
using ExamForge.Domain.Enums;
using ExamForge.Domain.Exceptions;
using ExamForge.Persistence.Context;
using Microsoft.EntityFrameworkCore;

namespace ExamForge.Persistence.Syncing;

public sealed class SyncService : ISyncService
{
    private static readonly JsonSerializerOptions JsonOptions = new(JsonSerializerDefaults.Web);

    private readonly ExamForgeDbContext _dbContext;

    public SyncService(ExamForgeDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<SyncUploadResponse> ProcessUploadAsync(
        SyncUploadRequest request,
        CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(request.DeviceId))
        {
            throw new DomainException("DeviceId is required.");
        }

        var changes = request.Changes ?? [];
        var results = new List<SyncUploadItemResult>(changes.Count);

        foreach (var change in changes)
        {
            try
            {
                var result = await ProcessChangeAsync(change, cancellationToken);
                results.Add(result);
            }
            catch (DomainException ex)
            {
                results.Add(new SyncUploadItemResult(
                    change.Id,
                    change.Entity,
                    "error",
                    null,
                    null,
                    null,
                    ex.Message));
            }
        }

        var serverSyncToken = await GetCurrentTokenAsync(cancellationToken);
        return new SyncUploadResponse(results, serverSyncToken);
    }

    public async Task<SyncDownloadResponse> GetChangesAsync(
        long? sinceToken,
        CancellationToken cancellationToken = default)
    {
        if (!sinceToken.HasValue)
        {
            var snapshotChanges = await BuildInitialSnapshotAsync(cancellationToken);
            return new SyncDownloadResponse(snapshotChanges, await GetCurrentTokenAsync(cancellationToken));
        }

        var query = _dbContext.SyncChangeLogEntries
            .AsNoTracking()
            .OrderBy(entry => entry.Id)
            .AsQueryable();

        query = query.Where(entry => entry.Id > sinceToken.Value);

        var entries = await query.ToListAsync(cancellationToken);
        var changes = entries.Select(ToChangeDto).ToList();
        var serverSyncToken = entries.Count == 0
            ? await GetCurrentTokenAsync(cancellationToken)
            : entries[^1].Id;

        return new SyncDownloadResponse(changes, serverSyncToken);
    }

    private async Task<SyncUploadItemResult> ProcessChangeAsync(
        SyncChangeDto change,
        CancellationToken cancellationToken)
    {
        if (string.Equals(change.Entity, SyncEntityNames.Subject, StringComparison.OrdinalIgnoreCase))
        {
            return await ProcessSubjectChangeAsync(change, cancellationToken);
        }

        if (string.Equals(change.Entity, SyncEntityNames.Question, StringComparison.OrdinalIgnoreCase))
        {
            return await ProcessQuestionChangeAsync(change, cancellationToken);
        }

        throw new DomainException($"Unsupported sync entity '{change.Entity}'.");
    }

    private async Task<SyncUploadItemResult> ProcessSubjectChangeAsync(
        SyncChangeDto change,
        CancellationToken cancellationToken)
    {
        if (string.Equals(change.Operation, SyncOperations.Upsert, StringComparison.OrdinalIgnoreCase))
        {
            return await UpsertSubjectAsync(change, cancellationToken);
        }

        if (string.Equals(change.Operation, SyncOperations.Delete, StringComparison.OrdinalIgnoreCase))
        {
            return await DeleteSubjectAsync(change, cancellationToken);
        }

        throw new DomainException($"Unsupported sync operation '{change.Operation}'.");
    }

    private async Task<SyncUploadItemResult> ProcessQuestionChangeAsync(
        SyncChangeDto change,
        CancellationToken cancellationToken)
    {
        if (string.Equals(change.Operation, SyncOperations.Upsert, StringComparison.OrdinalIgnoreCase))
        {
            return await UpsertQuestionAsync(change, cancellationToken);
        }

        if (string.Equals(change.Operation, SyncOperations.Delete, StringComparison.OrdinalIgnoreCase))
        {
            return await DeleteQuestionAsync(change, cancellationToken);
        }

        throw new DomainException($"Unsupported sync operation '{change.Operation}'.");
    }

    private async Task<SyncUploadItemResult> UpsertSubjectAsync(
        SyncChangeDto change,
        CancellationToken cancellationToken)
    {
        var payload = Deserialize<SubjectSyncPayload>(change.Data);

        await using var transaction = await _dbContext.Database.BeginTransactionAsync(cancellationToken);

        var subject = await _dbContext.Subjects
            .IgnoreQueryFilters()
            .FirstOrDefaultAsync(item => item.Id == change.Id, cancellationToken);

        if (subject is null)
        {
            if (change.Version != 0)
            {
                return Conflict(change, "The record no longer exists on the server.");
            }

            subject = Subject.Create(payload.Name, payload.Code, payload.Description);
            SetEntityId(subject, change.Id);
            if (!payload.IsActive)
            {
                subject.Deactivate();
            }
            _dbContext.Subjects.Add(subject);
        }
        else if (subject.IsDeleted)
        {
            return Conflict(subject, change);
        }
        else if (subject.Version != change.Version)
        {
            return Conflict(subject, change);
        }
        else
        {
            subject.Update(payload.Name, payload.Code, payload.Description);
            if (subject.IsActive != payload.IsActive)
            {
                if (payload.IsActive)
                {
                    subject.Activate();
                }
                else
                {
                    subject.Deactivate();
                }
            }
        }

        await _dbContext.SaveChangesAsync(cancellationToken);
        await AppendChangeLogAsync(subject, SyncEntityNames.Subject, SyncOperations.Upsert, cancellationToken);
        await _dbContext.SaveChangesAsync(cancellationToken);
        await transaction.CommitAsync(cancellationToken);

        return ToSuccessResult(subject, SyncEntityNames.Subject);
    }

    private async Task<SyncUploadItemResult> DeleteSubjectAsync(
        SyncChangeDto change,
        CancellationToken cancellationToken)
    {
        await using var transaction = await _dbContext.Database.BeginTransactionAsync(cancellationToken);

        var subject = await _dbContext.Subjects
            .IgnoreQueryFilters()
            .Include(item => item.Questions)
                .ThenInclude(question => question.BlankAnswers)
            .FirstOrDefaultAsync(item => item.Id == change.Id, cancellationToken);

        if (subject is null)
        {
            if (change.Version != 0)
            {
                return Conflict(change, "The record no longer exists on the server.");
            }

            return new SyncUploadItemResult(
                change.Id,
                SyncEntityNames.Subject,
                "ok",
                0,
                DateTimeOffset.UtcNow,
                null,
                null);
        }

        if (subject.IsDeleted)
        {
            return Conflict(subject, change);
        }

        if (subject.Version != change.Version)
        {
            return Conflict(subject, change);
        }

        foreach (var question in subject.Questions.ToList())
        {
            _dbContext.Questions.Remove(question);
        }

        _dbContext.Subjects.Remove(subject);
        await _dbContext.SaveChangesAsync(cancellationToken);
        await AppendChangeLogAsync(subject, SyncEntityNames.Subject, SyncOperations.Delete, cancellationToken);
        await _dbContext.SaveChangesAsync(cancellationToken);
        await transaction.CommitAsync(cancellationToken);

        return ToSuccessResult(subject, SyncEntityNames.Subject);
    }

    private async Task<SyncUploadItemResult> UpsertQuestionAsync(
        SyncChangeDto change,
        CancellationToken cancellationToken)
    {
        var payload = Deserialize<QuestionSyncPayload>(change.Data);

        if (payload.Id != change.Id)
        {
            throw new DomainException("Question payload Id does not match sync envelope Id.");
        }

        await using var transaction = await _dbContext.Database.BeginTransactionAsync(cancellationToken);

        var question = await _dbContext.Questions
            .IgnoreQueryFilters()
            .Include(item => item.BlankAnswers)
            .FirstOrDefaultAsync(item => item.Id == change.Id, cancellationToken);

        var subject = await _dbContext.Subjects
            .IgnoreQueryFilters()
            .FirstOrDefaultAsync(item => item.Id == payload.SubjectId, cancellationToken);

        if (subject is null)
        {
            throw new DomainException($"Subject '{payload.SubjectId}' was not found.");
        }

        var createdBy = await _dbContext.Users
            .IgnoreQueryFilters()
            .FirstOrDefaultAsync(item => item.Id == payload.CreatedById, cancellationToken);

        if (createdBy is null)
        {
            throw new DomainException($"User '{payload.CreatedById}' was not found.");
        }

        if (question is null)
        {
            if (change.Version != 0)
            {
                return Conflict(change, "The record no longer exists on the server.");
            }

            question = CreateQuestion(payload, subject, createdBy);
            SetEntityId(question, change.Id);
            ApplyBlankAnswerIds(question, payload.BlankAnswers);

            if (!payload.IsActive)
            {
                question.Deactivate();
            }

            _dbContext.Questions.Add(question);
        }
        else if (question.IsDeleted)
        {
            return Conflict(question, change);
        }
        else if (question.Version != change.Version)
        {
            return Conflict(question, change);
        }
        else
        {
            if (question.SubjectId != payload.SubjectId || question.CreatedById != payload.CreatedById)
            {
                throw new DomainException("Question subject or creator cannot change during sync.");
            }

            if (question.Type != payload.Type)
            {
                throw new DomainException("Question type cannot change during sync.");
            }

            question.UpdateText(payload.Text);
            question.UpdateMarks(payload.Marks);

            if (payload.IsActive != question.IsActive)
            {
                if (payload.IsActive)
                {
                    question.Activate();
                }
                else
                {
                    question.Deactivate();
                }
            }

            ApplyQuestionSpecificPayload(question, payload);

            if (question.Type == QuestionType.FillInTheBlank)
            {
                ApplyBlankAnswerIds(question, payload.BlankAnswers);
            }
        }

        await _dbContext.SaveChangesAsync(cancellationToken);
        await AppendChangeLogAsync(question, SyncEntityNames.Question, SyncOperations.Upsert, cancellationToken);
        await _dbContext.SaveChangesAsync(cancellationToken);
        await transaction.CommitAsync(cancellationToken);

        return ToSuccessResult(question, SyncEntityNames.Question);
    }

    private async Task<SyncUploadItemResult> DeleteQuestionAsync(
        SyncChangeDto change,
        CancellationToken cancellationToken)
    {
        await using var transaction = await _dbContext.Database.BeginTransactionAsync(cancellationToken);

        var question = await _dbContext.Questions
            .IgnoreQueryFilters()
            .Include(item => item.BlankAnswers)
            .FirstOrDefaultAsync(item => item.Id == change.Id, cancellationToken);

        if (question is null)
        {
            if (change.Version != 0)
            {
                return Conflict(change, "The record no longer exists on the server.");
            }

            return new SyncUploadItemResult(
                change.Id,
                SyncEntityNames.Question,
                "ok",
                0,
                DateTimeOffset.UtcNow,
                null,
                null);
        }

        if (question.IsDeleted)
        {
            return Conflict(question, change);
        }

        if (question.Version != change.Version)
        {
            return Conflict(question, change);
        }

        _dbContext.Questions.Remove(question);
        await _dbContext.SaveChangesAsync(cancellationToken);
        await AppendChangeLogAsync(question, SyncEntityNames.Question, SyncOperations.Delete, cancellationToken);
        await _dbContext.SaveChangesAsync(cancellationToken);
        await transaction.CommitAsync(cancellationToken);

        return ToSuccessResult(question, SyncEntityNames.Question);
    }

    private static Question CreateQuestion(
        QuestionSyncPayload payload,
        Subject subject,
        User createdBy)
    {
        return payload.Type switch
        {
            QuestionType.MultipleChoice => Question.CreateMultipleChoice(
                subject,
                createdBy,
                payload.Text,
                payload.Marks,
                new McqOptions(
                    payload.McqOptions?.OptionA ?? throw new DomainException("MCQ option A is required."),
                    payload.McqOptions?.OptionB ?? throw new DomainException("MCQ option B is required."),
                    payload.McqOptions?.OptionC ?? throw new DomainException("MCQ option C is required."),
                    payload.McqOptions?.OptionD ?? throw new DomainException("MCQ option D is required."),
                    payload.McqOptions?.CorrectOption
                    ?? throw new DomainException("MCQ correct option is required."))),
            QuestionType.TrueFalse => Question.CreateTrueFalse(
                subject,
                createdBy,
                payload.Text,
                payload.Marks,
                payload.TrueFalseAnswer ?? throw new DomainException("True/false answer is required.")),
            QuestionType.FillInTheBlank => Question.CreateFillInTheBlank(
                subject,
                createdBy,
                payload.Text,
                payload.Marks,
                (payload.BlankAnswers ?? throw new DomainException("Blank answers are required."))
                    .OrderBy(item => item.SortOrder)
                    .Select(item => item.Answer)),
            QuestionType.ShortQuestion => Question.CreateShortQuestion(
                subject,
                createdBy,
                payload.Text,
                payload.Marks,
                payload.ModelAnswer),
            QuestionType.LongQuestion => Question.CreateLongQuestion(
                subject,
                createdBy,
                payload.Text,
                payload.Marks,
                payload.ModelAnswer),
            _ => throw new DomainException("Unsupported question type.")
        };
    }

    private static void ApplyQuestionSpecificPayload(
        Question question,
        QuestionSyncPayload payload)
    {
        switch (payload.Type)
        {
            case QuestionType.MultipleChoice:
                question.UpdateMcqOptions(new McqOptions(
                    payload.McqOptions?.OptionA ?? throw new DomainException("MCQ option A is required."),
                    payload.McqOptions?.OptionB ?? throw new DomainException("MCQ option B is required."),
                    payload.McqOptions?.OptionC ?? throw new DomainException("MCQ option C is required."),
                    payload.McqOptions?.OptionD ?? throw new DomainException("MCQ option D is required."),
                    payload.McqOptions?.CorrectOption
                    ?? throw new DomainException("MCQ correct option is required.")));
                break;
            case QuestionType.TrueFalse:
                question.UpdateTrueFalseAnswer(
                    payload.TrueFalseAnswer ?? throw new DomainException("True/false answer is required."));
                break;
            case QuestionType.FillInTheBlank:
                question.ReplaceBlankAnswers(
                    (payload.BlankAnswers ?? throw new DomainException("Blank answers are required."))
                        .OrderBy(item => item.SortOrder)
                        .Select(item => item.Answer));
                break;
            case QuestionType.ShortQuestion:
            case QuestionType.LongQuestion:
                question.UpdateModelAnswer(payload.ModelAnswer);
                break;
            default:
                throw new DomainException("Unsupported question type.");
        }
    }

    private static void ApplyBlankAnswerIds(
        Question question,
        IReadOnlyList<QuestionBlankAnswerSyncPayload>? payloadBlankAnswers)
    {
        if (payloadBlankAnswers is null)
        {
            return;
        }

        foreach (var (blankAnswer, source) in question.BlankAnswers
                     .Zip(payloadBlankAnswers.OrderBy(item => item.SortOrder)))
        {
            if (source.Id.HasValue)
            {
                SetEntityId(blankAnswer, source.Id.Value);
            }
        }
    }

    private async Task AppendChangeLogAsync(
        BaseEntity entity,
        string entityName,
        string operation,
        CancellationToken cancellationToken)
    {
        var payload = entity switch
        {
            Subject subject => CreateSubjectPayload(subject),
            Question question => CreateQuestionPayload(question),
            _ => throw new DomainException($"Unsupported sync entity '{entity.GetType().Name}'.")
        };

        var entry = new SyncChangeLogEntry
        {
            Entity = entityName,
            EntityId = entity.Id,
            Operation = operation,
            Version = entity.Version,
            UpdatedAt = entity.UpdatedAt,
            PayloadJson = JsonSerializer.Serialize(payload, JsonOptions),
            CreatedAt = DateTimeOffset.UtcNow
        };

        _dbContext.SyncChangeLogEntries.Add(entry);
        await Task.CompletedTask;
    }

    private static SyncUploadItemResult ToSuccessResult(
        BaseEntity entity,
        string entityName)
    {
        var payload = entity switch
        {
            Subject subject => CreateSubjectPayload(subject),
            Question question => CreateQuestionPayload(question),
            _ => throw new DomainException($"Unsupported sync entity '{entity.GetType().Name}'.")
        };

        return new SyncUploadItemResult(
            entity.Id,
            entityName,
            "ok",
            entity.Version,
            entity.UpdatedAt,
            JsonSerializer.SerializeToElement(payload, JsonOptions),
            null);
    }

    private static SyncUploadItemResult Conflict(BaseEntity entity, SyncChangeDto change)
    {
        var payload = entity switch
        {
            Subject subject => CreateSubjectPayload(subject),
            Question question => CreateQuestionPayload(question),
            _ => throw new DomainException($"Unsupported sync entity '{entity.GetType().Name}'.")
        };

        return new SyncUploadItemResult(
            change.Id,
            change.Entity,
            "conflict",
            entity.Version,
            entity.UpdatedAt,
            JsonSerializer.SerializeToElement(payload, JsonOptions),
            $"Version mismatch. Client version {change.Version}, server version {entity.Version}.");
    }

    private static SyncUploadItemResult Conflict(SyncChangeDto change, string message)
    {
        return new SyncUploadItemResult(
            change.Id,
            change.Entity,
            "conflict",
            null,
            null,
            null,
            message);
    }

    private static SyncChangeDto ToChangeDto(SyncChangeLogEntry entry)
    {
        var data = string.IsNullOrWhiteSpace(entry.PayloadJson)
            ? null
            : JsonSerializer.Deserialize<JsonElement>(entry.PayloadJson, JsonOptions);

        return new SyncChangeDto(
            entry.Entity,
            entry.Operation,
            entry.EntityId,
            entry.Version,
            entry.UpdatedAt,
            data);
    }

    private async Task<List<SyncChangeDto>> BuildInitialSnapshotAsync(CancellationToken cancellationToken)
    {
        var subjectSnapshots = await _dbContext.Subjects
            .AsNoTracking()
            .OrderBy(entity => entity.Id)
            .ToListAsync(cancellationToken);

        var questionSnapshots = await _dbContext.Questions
            .AsNoTracking()
            .Include(entity => entity.BlankAnswers)
            .OrderBy(entity => entity.Id)
            .ToListAsync(cancellationToken);

        var changes = new List<SyncChangeDto>(subjectSnapshots.Count + questionSnapshots.Count);

        changes.AddRange(subjectSnapshots.Select(subject => new SyncChangeDto(
            SyncEntityNames.Subject,
            SyncOperations.Upsert,
            subject.Id,
            subject.Version,
            subject.UpdatedAt,
            JsonSerializer.SerializeToElement(CreateSubjectPayload(subject), JsonOptions))));

        changes.AddRange(questionSnapshots.Select(question => new SyncChangeDto(
            SyncEntityNames.Question,
            SyncOperations.Upsert,
            question.Id,
            question.Version,
            question.UpdatedAt,
            JsonSerializer.SerializeToElement(CreateQuestionPayload(question), JsonOptions))));

        return changes;
    }

    private static SubjectSyncPayload CreateSubjectPayload(Subject subject) =>
        new(subject.Id, subject.Name, subject.Code, subject.Description, subject.IsActive);

    private static QuestionSyncPayload CreateQuestionPayload(Question question) =>
        new(
            question.Id,
            question.SubjectId,
            question.CreatedById,
            question.Type,
            question.Text,
            question.Marks,
            question.IsActive,
            question.ModelAnswer,
            question.TrueFalseAnswer,
            question.McqOptions is null
                ? null
                : new McqOptionsSyncPayload(
                    question.McqOptions.OptionA,
                    question.McqOptions.OptionB,
                    question.McqOptions.OptionC,
                    question.McqOptions.OptionD,
                    question.McqOptions.CorrectOption),
            question.BlankAnswers
                .OrderBy(item => item.SortOrder)
                .Select(item => new QuestionBlankAnswerSyncPayload(item.Id, item.Answer, item.SortOrder))
                .ToList());

    private async Task<long> GetCurrentTokenAsync(CancellationToken cancellationToken)
    {
        var current = await _dbContext.SyncChangeLogEntries
            .AsNoTracking()
            .OrderByDescending(entry => entry.Id)
            .Select(entry => (long?)entry.Id)
            .FirstOrDefaultAsync(cancellationToken);

        return current ?? 0;
    }

    private static TPayload Deserialize<TPayload>(JsonElement? data)
    {
        if (data is null)
        {
            throw new DomainException("Sync payload is required.");
        }

        try
        {
            var payload = JsonSerializer.Deserialize<TPayload>(data.Value.GetRawText(), JsonOptions);
            return payload ?? throw new DomainException("Sync payload could not be parsed.");
        }
        catch (JsonException ex)
        {
            throw new DomainException($"Sync payload could not be parsed: {ex.Message}");
        }
    }

    private static void SetEntityId(BaseEntity entity, Guid id)
    {
        var property = entity.GetType().GetProperty(
            nameof(BaseEntity.Id),
            BindingFlags.Instance | BindingFlags.Public | BindingFlags.NonPublic);

        property?.SetValue(entity, id);
    }
}
