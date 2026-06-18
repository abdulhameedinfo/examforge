using ExamForge.Domain.Entities;
using ExamForge.Domain.Enums;
using ExamForge.Domain.PaperGeneration;
using ExamForge.Domain.ValueObjects;
using Xunit;

namespace ExamForge.Domain.Tests.PaperGeneration;

public sealed class PaperGenerationEngineTests
{
    private readonly PaperGenerationEngine _engine = new();
    private readonly Guid _subjectId = Guid.Parse("11111111-1111-1111-1111-111111111111");
    private readonly Guid _teacherA = Guid.Parse("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa");
    private readonly Guid _teacherB = Guid.Parse("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb");

    [Fact]
    public void Generate_UsesLargestRemainderDistribution()
    {
        var pool = BuildPool([
            (QuestionType.MultipleChoice, _teacherA, 10),
            (QuestionType.ShortQuestion, _teacherA, 10),
            (QuestionType.LongQuestion, _teacherA, 10)
        ]);

        var result = _engine.Generate(new PaperGenerationCriteria
        {
            SubjectId = _subjectId,
            TotalQuestions = 10,
            TypePercentages = new Dictionary<QuestionType, decimal>
            {
                [QuestionType.MultipleChoice] = 33m,
                [QuestionType.ShortQuestion] = 33m,
                [QuestionType.LongQuestion] = 34m
            },
            Seed = 42
        }, pool);

        Assert.Equal(10, result.TotalQuestions);
        Assert.Equal(3, result.Sections.Single(s => s.Type == QuestionType.MultipleChoice).Questions.Count);
        Assert.Equal(3, result.Sections.Single(s => s.Type == QuestionType.ShortQuestion).Questions.Count);
        Assert.Equal(4, result.Sections.Single(s => s.Type == QuestionType.LongQuestion).Questions.Count);
    }

    [Fact]
    public void Generate_IsDeterministicForSameSeed()
    {
        var pool = BuildPool([
            (QuestionType.MultipleChoice, _teacherA, 20)
        ]);

        var criteria = new PaperGenerationCriteria
        {
            SubjectId = _subjectId,
            TotalQuestions = 5,
            TypePercentages = new Dictionary<QuestionType, decimal>
            {
                [QuestionType.MultipleChoice] = 100m
            },
            Seed = 99
        };

        var first = _engine.Generate(criteria, pool);
        var second = _engine.Generate(criteria, pool);

        Assert.Equal(
            first.Sections.Single().Questions.Select(q => q.Id),
            second.Sections.Single().Questions.Select(q => q.Id));
    }

    [Fact]
    public void Generate_DoesNotSelectDuplicateQuestions()
    {
        var pool = BuildPool([
            (QuestionType.MultipleChoice, _teacherA, 8)
        ]);

        var result = _engine.Generate(new PaperGenerationCriteria
        {
            SubjectId = _subjectId,
            TotalQuestions = 8,
            TypePercentages = new Dictionary<QuestionType, decimal>
            {
                [QuestionType.MultipleChoice] = 100m
            },
            Seed = 7
        }, pool);

        var ids = result.Sections.SelectMany(s => s.Questions).Select(q => q.Id).ToList();
        Assert.Equal(ids.Count, ids.Distinct().Count());
    }

    [Fact]
    public void Generate_AppliesTeacherDistribution()
    {
        var pool = BuildPool([
            (QuestionType.MultipleChoice, _teacherA, 10),
            (QuestionType.MultipleChoice, _teacherB, 10)
        ]);

        var result = _engine.Generate(new PaperGenerationCriteria
        {
            SubjectId = _subjectId,
            TotalQuestions = 10,
            TypePercentages = new Dictionary<QuestionType, decimal>
            {
                [QuestionType.MultipleChoice] = 100m
            },
            TeacherDistribution =
            [
                new TeacherShare(_teacherA, 80m),
                new TeacherShare(null, 20m)
            ],
            Seed = 5
        }, pool);

        var selected = result.Sections.Single().Questions;
        Assert.Equal(8, selected.Count(q => q.CreatedById == _teacherA));
        Assert.Equal(2, selected.Count(q => q.CreatedById == _teacherB));
    }

    [Fact]
    public void Generate_ThrowsWhenPoolIsInsufficient()
    {
        var pool = BuildPool([
            (QuestionType.MultipleChoice, _teacherA, 2)
        ]);

        var exception = Assert.Throws<InsufficientQuestionPoolException>(() =>
            _engine.Generate(new PaperGenerationCriteria
            {
                SubjectId = _subjectId,
                TotalQuestions = 5,
                TypePercentages = new Dictionary<QuestionType, decimal>
                {
                    [QuestionType.MultipleChoice] = 100m
                },
                Seed = 1
            }, pool));

        Assert.NotEmpty(exception.Shortfalls);
        Assert.Equal(QuestionType.MultipleChoice, exception.Shortfalls[0].Type);
        Assert.Equal(5, exception.Shortfalls[0].Required);
        Assert.Equal(2, exception.Shortfalls[0].Available);
    }

    private IReadOnlyList<Question> BuildPool(
        IEnumerable<(QuestionType Type, Guid TeacherId, int Count)> specs)
    {
        var subject = Subject.Create("Mathematics", "MATH");
        typeof(Subject).GetProperty(nameof(Subject.Id))!
            .SetValue(subject, _subjectId);

        var questions = new List<Question>();

        foreach (var (type, teacherId, count) in specs)
        {
            var teacher = User.Create($"{teacherId}@test.com", $"Teacher {teacherId}", UserRole.Teacher);
            typeof(User).GetProperty(nameof(User.Id))!
                .SetValue(teacher, teacherId);

            for (var i = 0; i < count; i++)
            {
                questions.Add(CreateQuestion(subject, teacher, type, i));
            }
        }

        return questions;
    }

    private static Question CreateQuestion(Subject subject, User teacher, QuestionType type, int index)
    {
        return type switch
        {
            QuestionType.MultipleChoice => Question.CreateMultipleChoice(
                subject,
                teacher,
                $"MCQ {index}",
                1,
                new McqOptions("A", "B", "C", "D", McqCorrectOption.A)),
            QuestionType.ShortQuestion => Question.CreateShortQuestion(
                subject,
                teacher,
                $"Short {index}",
                2),
            QuestionType.LongQuestion => Question.CreateLongQuestion(
                subject,
                teacher,
                $"Long {index}",
                5),
            QuestionType.TrueFalse => Question.CreateTrueFalse(
                subject,
                teacher,
                $"TF {index}",
                1,
                true),
            QuestionType.FillInTheBlank => Question.CreateFillInTheBlank(
                subject,
                teacher,
                $"Blank {index}",
                1,
                ["answer"]),
            _ => throw new ArgumentOutOfRangeException(nameof(type))
        };
    }
}
