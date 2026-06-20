using ExamForge.Persistence.Syncing;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ExamForge.Persistence.Configurations;

public sealed class SyncChangeLogConfiguration : IEntityTypeConfiguration<SyncChangeLogEntry>
{
    public void Configure(EntityTypeBuilder<SyncChangeLogEntry> builder)
    {
        builder.ToTable("sync_change_log");
        builder.HasKey(entry => entry.Id);

        builder.Property(entry => entry.Entity).HasMaxLength(64).IsRequired();
        builder.Property(entry => entry.Operation).HasMaxLength(16).IsRequired();
        builder.Property(entry => entry.PayloadJson).IsRequired();
        builder.Property(entry => entry.UpdatedAt).IsRequired();
        builder.Property(entry => entry.CreatedAt).IsRequired();
        builder.Property(entry => entry.Version).IsRequired();

        builder.HasIndex(entry => entry.CreatedAt);
        builder.HasIndex(entry => new { entry.Entity, entry.EntityId, entry.Version });
    }
}

