using ExamForge.Domain.Entities;
using ExamForge.Domain.ValueObjects;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ExamForge.Persistence.Configurations;

public sealed class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.ToTable("users");
        builder.HasKey(user => user.Id);
        builder.HasQueryFilter(user => !user.IsDeleted);

        builder.Property(user => user.Email).HasMaxLength(256).IsRequired();
        builder.Property(user => user.FullName).HasMaxLength(200).IsRequired();
        builder.Property(user => user.Role).IsRequired();
        builder.Property(user => user.IsActive).IsRequired();
        builder.Property(user => user.Version).IsConcurrencyToken();

        builder.HasIndex(user => user.Email)
            .IsUnique()
            .HasFilter("\"IsDeleted\" = false");

        builder.Navigation(user => user.CreatedQuestions)
            .UsePropertyAccessMode(PropertyAccessMode.Field);

        builder.Navigation(user => user.CreatedPaperTemplates)
            .UsePropertyAccessMode(PropertyAccessMode.Field);
    }
}
