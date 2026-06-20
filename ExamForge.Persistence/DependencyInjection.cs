using ExamForge.Application.Abstractions;
using ExamForge.Domain.Common;
using ExamForge.Domain.Entities;
using ExamForge.Persistence.Context;
using ExamForge.Persistence.Repositories;
using ExamForge.Persistence.Syncing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace ExamForge.Persistence;

public static class DependencyInjection
{
    public static IServiceCollection AddPersistence(this IServiceCollection services, IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString("Postgres");
        if (string.IsNullOrWhiteSpace(connectionString))
            throw new InvalidOperationException("Connection string 'Postgres' is required.");

        services.AddDbContext<ExamForgeDbContext>(options =>
        {
            options.UseNpgsql(connectionString);
        });

        services.AddScoped<IQuestionPoolRepository, QuestionPoolRepository>();
        services.AddScoped<ISubjectReadRepository, SubjectReadRepository>();
        services.AddScoped<ISyncService, SyncService>();

        return services;
    }
}
