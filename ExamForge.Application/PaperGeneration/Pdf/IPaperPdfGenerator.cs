using ExamForge.Application.PaperGeneration.Dtos;

namespace ExamForge.Application.PaperGeneration.Pdf;

public interface IPaperPdfGenerator
{
    byte[] Generate(PaperPdfModel paper);
}
