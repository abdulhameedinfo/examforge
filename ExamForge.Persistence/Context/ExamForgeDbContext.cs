using ExamForge.Domain.Common;
using Microsoft.EntityFrameworkCore;

namespace ExamForge.Persistence.Context;

public sealed class ExamForgeDbContext : DbContext
{
    public ExamForgeDbContext(DbContextOptions<ExamForgeDbContext> options) : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(ExamForgeDbContext).Assembly);

        foreach (var entityType in modelBuilder.Model.GetEntityTypes())
        {
            if (!typeof(BaseEntity).IsAssignableFrom(entityType.ClrType))
                continue;

            modelBuilder
                .Entity(entityType.ClrType)
                .Property(nameof(BaseEntity.Version))
                .IsConcurrencyToken();
        }
    }

    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        ApplyAuditFields();
        return base.SaveChangesAsync(cancellationToken);
    }

    public override int SaveChanges()
    {
        ApplyAuditFields();
        return base.SaveChanges();
    }

    private void ApplyAuditFields()
    {
        var now = DateTimeOffset.UtcNow;

        foreach (var entry in ChangeTracker.Entries<BaseEntity>())
        {
            if (entry.State == EntityState.Added)
            {
                entry.Property(entity => entity.CreatedAt).CurrentValue = now;
                entry.Property(entity => entity.UpdatedAt).CurrentValue = now;
                entry.Property(entity => entity.Version).CurrentValue = 1;
            }

            if (entry.State == EntityState.Modified)
            {
                entry.Property(entity => entity.CreatedAt).IsModified = false;
                entry.Property(entity => entity.UpdatedAt).CurrentValue = now;
                entry.Property(entity => entity.Version).CurrentValue++;
            }
        }
    }
}
