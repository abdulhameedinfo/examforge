using ExamForge.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ExamForge.Persistence.Configurations;

public sealed class SubjectConfiguration : IEntityTypeConfiguration<Subject>
{
    public void Configure(EntityTypeBuilder<Subject> builder)
    {
        builder.ToTable("subjects");
        builder.HasKey(subject => subject.Id);
        builder.HasQueryFilter(subject => !subject.IsDeleted);

        builder.Property(subject => subject.Name).HasMaxLength(200).IsRequired();
        builder.Property(subject => subject.Code).HasMaxLength(20).IsRequired();
        builder.Property(subject => subject.Description).HasMaxLength(1000);
        builder.Property(subject => subject.IsActive).IsRequired();
        builder.Property(subject => subject.Version).IsConcurrencyToken();

        builder.HasIndex(subject => subject.Code)
            .IsUnique()
            .HasFilter("\"IsDeleted\" = false");

        builder.Navigation(subject => subject.Questions)
            .UsePropertyAccessMode(PropertyAccessMode.Field);

        builder.Navigation(subject => subject.PaperTemplates)
            .UsePropertyAccessMode(PropertyAccessMode.Field);
    }
}
