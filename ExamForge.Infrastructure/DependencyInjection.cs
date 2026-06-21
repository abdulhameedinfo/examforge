using ExamForge.Application.PaperGeneration.Pdf;
using ExamForge.Infrastructure.PaperGeneration.Pdf;
using Microsoft.Extensions.DependencyInjection;

namespace ExamForge.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services)
    {
        services.AddScoped<IPaperPdfGenerator, QuestPdfPaperPdfGenerator>();
        return services;
    }
}
