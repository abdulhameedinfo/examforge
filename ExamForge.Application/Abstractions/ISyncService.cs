using System.Text.Json;

namespace ExamForge.Application.Abstractions;

public interface ISyncService
{
    Task<SyncUploadResponse> ProcessUploadAsync(
        SyncUploadRequest request,
        CancellationToken cancellationToken = default);

    Task<SyncDownloadResponse> GetChangesAsync(
        long? sinceToken,
        CancellationToken cancellationToken = default);
}

public sealed record SyncUploadRequest(
    string DeviceId,
    List<SyncChangeDto> Changes);

public sealed record SyncDownloadResponse(
    List<SyncChangeDto> Changes,
    long ServerSyncToken);

public sealed record SyncUploadResponse(
    List<SyncUploadItemResult> Results,
    long ServerSyncToken);

public sealed record SyncUploadItemResult(
    Guid Id,
    string Entity,
    string Status,
    long? NewVersion,
    DateTimeOffset? UpdatedAt,
    JsonElement? ServerRecord,
    string? Message);

public sealed record SyncChangeDto(
    string Entity,
    string Operation,
    Guid Id,
    long Version,
    DateTimeOffset UpdatedAt,
    JsonElement? Data);
