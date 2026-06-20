namespace ExamForge.Persistence.Syncing;

public sealed class SyncChangeLogEntry
{
    public long Id { get; set; }
    public string Entity { get; set; } = null!;
    public Guid EntityId { get; set; }
    public string Operation { get; set; } = null!;
    public long Version { get; set; }
    public DateTimeOffset UpdatedAt { get; set; }
    public string PayloadJson { get; set; } = null!;
    public DateTimeOffset CreatedAt { get; set; }
}

