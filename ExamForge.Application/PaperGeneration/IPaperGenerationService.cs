using ExamForge.Application.PaperGeneration.Dtos;

namespace ExamForge.Application.PaperGeneration;

public interface IPaperGenerationService
{
    Task<GeneratePaperResponseDto> GenerateAsync(
        GeneratePaperRequestDto request,
        CancellationToken cancellationToken = default);
}
