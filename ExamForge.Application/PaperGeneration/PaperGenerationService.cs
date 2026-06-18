using ExamForge.Application.Abstractions;
using ExamForge.Application.PaperGeneration.Dtos;
using ExamForge.Domain.Entities;
using ExamForge.Domain.Enums;
using ExamForge.Domain.Exceptions;
using ExamForge.Domain.PaperGeneration;

namespace ExamForge.Application.PaperGeneration;

public sealed class PaperGenerationService : IPaperGenerationService
{
    private readonly IQuestionPoolRepository _questionPoolRepository;
    private readonly ISubjectReadRepository _subjectRepository;
    private readonly PaperGenerationEngine _engine;

    public PaperGenerationService(
        IQuestionPoolRepository questionPoolRepository,
        ISubjectReadRepository subjectRepository,
        PaperGenerationEngine engine)
    {
        _questionPoolRepository = questionPoolRepository;
        _subjectRepository = subjectRepository;
        _engine = engine;
    }

    public async Task<GeneratePaperResponseDto> GenerateAsync(
        GeneratePaperRequestDto request,
        CancellationToken cancellationToken = default)
    {
        var subject = await _subjectRepository.GetByIdAsync(request.SubjectId, cancellationToken);
        if (subject is null || subject.IsDeleted)
        {
            throw new NotFoundException($"Subject '{request.SubjectId}' was not found.");
        }

        if (!subject.IsActive)
        {
            throw new DomainException("Exam papers cannot be generated for an inactive subject.");
        }

        var criteria = MapCriteria(request);
        var pool = await _questionPoolRepository.GetActiveBySubjectAsync(request.SubjectId, cancellationToken);
        var result = _engine.Generate(criteria, pool);

        return MapResponse(result, subject.Name);
    }

    private static PaperGenerationCriteria MapCriteria(GeneratePaperRequestDto request)
    {
        return new PaperGenerationCriteria
        {
            SubjectId = request.SubjectId,
            TotalQuestions = request.TotalQuestions,
            TypePercentages = request.TypeDistribution.ToDictionary(
                item => item.Type,
                item => item.Percentage),
            TeacherDistribution = request.TeacherDistribution?
                .Select(item => new TeacherShare(item.TeacherId, item.Percentage))
                .ToList(),
            Seed = request.Seed
        };
    }

    private static GeneratePaperResponseDto MapResponse(GeneratedPaperResult result, string subjectName)
    {
        return new GeneratePaperResponseDto
        {
            SubjectId = result.SubjectId,
            SubjectName = subjectName,
            Seed = result.Seed,
            TotalQuestions = result.TotalQuestions,
            TotalMarks = result.TotalMarks,
            Sections = result.Sections
                .Select(section => new GeneratedPaperSectionDto
                {
                    Type = section.Type,
                    RequestedCount = section.RequestedCount,
                    SelectedCount = section.Questions.Count,
                    SectionMarks = section.Questions.Sum(q => q.Marks),
                    Questions = section.Questions.Select(MapQuestion).ToList()
                })
                .ToList()
        };
    }

    private static GeneratedQuestionDto MapQuestion(Question question)
    {
        return new GeneratedQuestionDto
        {
            Id = question.Id,
            CreatedById = question.CreatedById,
            CreatedByName = question.CreatedBy?.FullName ?? string.Empty,
            Type = question.Type,
            Text = question.Text,
            Marks = question.Marks,
            TrueFalseAnswer = question.TrueFalseAnswer,
            ModelAnswer = question.ModelAnswer,
            BlankAnswers = question.BlankAnswers.Select(a => a.Answer).ToList(),
            McqOptions = question.McqOptions is null
                ? null
                : new McqOptionsDto
                {
                    OptionA = question.McqOptions.OptionA,
                    OptionB = question.McqOptions.OptionB,
                    OptionC = question.McqOptions.OptionC,
                    OptionD = question.McqOptions.OptionD,
                    CorrectOption = question.McqOptions.CorrectOption.ToString()
                }
        };
    }
}

public sealed class NotFoundException : Exception
{
    public NotFoundException(string message) : base(message)
    {
    }
}
