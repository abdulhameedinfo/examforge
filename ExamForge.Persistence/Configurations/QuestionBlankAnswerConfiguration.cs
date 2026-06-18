using ExamForge.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ExamForge.Persistence.Configurations;

public sealed class QuestionBlankAnswerConfiguration : IEntityTypeConfiguration<QuestionBlankAnswer>
{
    public void Configure(EntityTypeBuilder<QuestionBlankAnswer> builder)
    {
        builder.ToTable("question_blank_answers");
        builder.HasKey(answer => answer.Id);
        builder.HasQueryFilter(answer => !answer.IsDeleted);

        builder.Property(answer => answer.Answer).HasMaxLength(500).IsRequired();
        builder.Property(answer => answer.SortOrder).IsRequired();
        builder.Property(answer => answer.Version).IsConcurrencyToken();

        builder.HasIndex(answer => answer.QuestionId)
            .HasFilter("\"IsDeleted\" = false");
    }
}
