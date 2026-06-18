using ExamForge.Application.PaperGeneration;
using ExamForge.Application.PaperGeneration.Validation;
using ExamForge.Domain.PaperGeneration;
using FluentValidation;
using Microsoft.Extensions.DependencyInjection;

namespace ExamForge.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddSingleton<PaperGenerationEngine>();
        services.AddScoped<IPaperGenerationService, PaperGenerationService>();
        services.AddValidatorsFromAssemblyContaining<GeneratePaperRequestValidator>();

        return services;
    }
}
