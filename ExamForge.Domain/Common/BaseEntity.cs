namespace ExamForge.Domain.Common;

public abstract class BaseEntity
{
    public Guid Id { get; protected set; } = Guid.NewGuid();
    public DateTimeOffset CreatedAt { get; protected set; }
    public DateTimeOffset UpdatedAt { get; protected set; }
    public long Version { get; protected set; } = 1;
    public bool IsDeleted { get; protected set; }

    protected void Touch() => UpdatedAt = DateTimeOffset.UtcNow;

    public void MarkAsDeleted()
    {
        IsDeleted = true;
        Touch();
    }
}
