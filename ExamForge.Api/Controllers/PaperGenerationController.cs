using ExamForge.Application.PaperGeneration;
using ExamForge.Application.PaperGeneration.Dtos;
using ExamForge.Application.PaperGeneration.Validation;
using ExamForge.Domain.Exceptions;
using ExamForge.Domain.PaperGeneration;
using FluentValidation;
using Microsoft.AspNetCore.Mvc;

namespace ExamForge.Api.Controllers;

[ApiController]
[Route("papers")]
public sealed class PaperGenerationController : ControllerBase
{
    private readonly IPaperGenerationService _paperGenerationService;
    private readonly IValidator<GeneratePaperRequestDto> _validator;

    public PaperGenerationController(
        IPaperGenerationService paperGenerationService,
        IValidator<GeneratePaperRequestDto> validator)
    {
        _paperGenerationService = paperGenerationService;
        _validator = validator;
    }

    /// <summary>
    /// Generates an exam paper from the question bank using percentage-based type and teacher distribution.
    /// </summary>
    [HttpPost("generate")]
    [ProducesResponseType(typeof(GeneratePaperResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(InsufficientQuestionsErrorDto), StatusCodes.Status422UnprocessableEntity)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Generate(
        [FromBody] GeneratePaperRequestDto request,
        CancellationToken cancellationToken)
    {
        var validationResult = await _validator.ValidateAsync(request, cancellationToken);
        if (!validationResult.IsValid)
        {
            foreach (var error in validationResult.Errors)
            {
                ModelState.AddModelError(error.PropertyName, error.ErrorMessage);
            }

            return ValidationProblem(ModelState);
        }

        try
        {
            var paper = await _paperGenerationService.GenerateAsync(request, cancellationToken);
            return Ok(paper);
        }
        catch (NotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (InsufficientQuestionPoolException ex)
        {
            return UnprocessableEntity(new InsufficientQuestionsErrorDto
            {
                Message = ex.Message,
                Shortfalls = ex.Shortfalls
                    .Select(shortfall => new QuestionShortfallDto
                    {
                        Type = shortfall.Type,
                        Required = shortfall.Required,
                        Available = shortfall.Available,
                        TeacherId = shortfall.TeacherId,
                        TeacherLabel = shortfall.TeacherLabel
                    })
                    .ToList()
            });
        }
        catch (DomainException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}
