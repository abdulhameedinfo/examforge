using ExamForge.Application.PaperGeneration.Dtos;
using ExamForge.Application.PaperGeneration.Pdf;
using ExamForge.Domain.Enums;
using Microsoft.AspNetCore.Mvc;

namespace ExamForge.Api.Controllers;

[ApiController]
[Route("papers")]
public sealed class PaperPdfController : ControllerBase
{
    private readonly IPaperPdfGenerator _paperPdfGenerator;

    public PaperPdfController(IPaperPdfGenerator paperPdfGenerator)
    {
        _paperPdfGenerator = paperPdfGenerator;
    }

    [HttpPost("pdf")]
    [Produces("application/pdf")]
    [ProducesResponseType(typeof(FileContentResult), StatusCodes.Status200OK)]
    public IActionResult GeneratePdf([FromBody] GeneratePaperResponseDto paper)
    {
        var pdfModel = MapPaper(paper);
        var pdfBytes = _paperPdfGenerator.Generate(pdfModel);
        var fileName = BuildFileName(pdfModel.SubjectName, pdfModel.GeneratedAt);

        return File(pdfBytes, "application/pdf", fileName);
    }

    private static PaperPdfModel MapPaper(GeneratePaperResponseDto paper)
    {
        return new PaperPdfModel
        {
            SubjectId = paper.SubjectId,
            SubjectName = paper.SubjectName,
            GeneratedAt = DateTimeOffset.UtcNow,
            TotalMarks = paper.TotalMarks,
            Sections = paper.Sections
                .Select(section => new PaperPdfSectionModel
                {
                    Title = FormatQuestionType(section.Type),
                    Questions = section.Questions
                })
                .ToList()
        };
    }

    private static string BuildFileName(string subjectName, DateTimeOffset generatedAt)
    {
        var safeSubject = new string(subjectName
            .Where(char.IsLetterOrDigit)
            .ToArray());

        if (string.IsNullOrWhiteSpace(safeSubject))
        {
            safeSubject = "paper";
        }

        return $"{safeSubject}-{generatedAt:yyyyMMdd-HHmm}.pdf";
    }

    private static string FormatQuestionType(QuestionType questionType) =>
        questionType switch
        {
            QuestionType.MultipleChoice => "Multiple Choice",
            QuestionType.ShortQuestion => "Short Questions",
            QuestionType.LongQuestion => "Long Questions",
            QuestionType.FillInTheBlank => "Fill in the Blank",
            QuestionType.TrueFalse => "True / False",
            _ => questionType.ToString()
        };
}
