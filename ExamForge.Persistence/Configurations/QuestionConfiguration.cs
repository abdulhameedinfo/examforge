using ExamForge.Domain.Entities;
using ExamForge.Domain.ValueObjects;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ExamForge.Persistence.Configurations;

public sealed class QuestionConfiguration : IEntityTypeConfiguration<Question>
{
    public void Configure(EntityTypeBuilder<Question> builder)
    {
        builder.ToTable("questions");
        builder.HasKey(question => question.Id);
        builder.HasQueryFilter(question => !question.IsDeleted);

        builder.Property(question => question.Text).HasMaxLength(4000).IsRequired();
        builder.Property(question => question.Marks).HasPrecision(5, 2).IsRequired();
        builder.Property(question => question.Type).IsRequired();
        builder.Property(question => question.IsActive).IsRequired();
        builder.Property(question => question.ModelAnswer).HasMaxLength(8000);
        builder.Property(question => question.Version).IsConcurrencyToken();

        builder.HasOne(question => question.Subject)
            .WithMany(subject => subject.Questions)
            .HasForeignKey(question => question.SubjectId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(question => question.CreatedBy)
            .WithMany(user => user.CreatedQuestions)
            .HasForeignKey(question => question.CreatedById)
            .OnDelete(DeleteBehavior.Restrict);

        builder.OwnsOne(question => question.McqOptions, mcq =>
        {
            mcq.Property(options => options.OptionA).HasColumnName("mcq_option_a").HasMaxLength(1000);
            mcq.Property(options => options.OptionB).HasColumnName("mcq_option_b").HasMaxLength(1000);
            mcq.Property(options => options.OptionC).HasColumnName("mcq_option_c").HasMaxLength(1000);
            mcq.Property(options => options.OptionD).HasColumnName("mcq_option_d").HasMaxLength(1000);
            mcq.Property(options => options.CorrectOption).HasColumnName("mcq_correct");
        });

        builder.HasMany(question => question.BlankAnswers)
            .WithOne(answer => answer.Question)
            .HasForeignKey(answer => answer.QuestionId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Navigation(question => question.BlankAnswers)
            .UsePropertyAccessMode(PropertyAccessMode.Field);

        builder.HasIndex(question => new { question.SubjectId, question.Type, question.IsActive })
            .HasFilter("\"IsDeleted\" = false")
            .HasDatabaseName("ix_questions_subject_type_active");

        builder.HasIndex(question => new { question.CreatedById, question.SubjectId, question.Type })
            .HasFilter("\"IsDeleted\" = false")
            .HasDatabaseName("ix_questions_teacher_subject_type");
    }
}
