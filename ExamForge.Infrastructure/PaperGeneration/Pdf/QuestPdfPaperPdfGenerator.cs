using System.Globalization;
using ExamForge.Application.PaperGeneration.Pdf;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;

namespace ExamForge.Infrastructure.PaperGeneration.Pdf;

public sealed class QuestPdfPaperPdfGenerator : IPaperPdfGenerator
{
    public byte[] Generate(PaperPdfModel paper)
    {
        ArgumentNullException.ThrowIfNull(paper);

        var document = Document.Create(container =>
        {
            container.Page(page =>
            {
                page.Size(PageSizes.A4);
                page.MarginHorizontal(36);
                page.MarginVertical(32);
                page.DefaultTextStyle(x => x.FontSize(11).FontColor(Colors.Grey.Darken4));

                page.Header().Element(header => ComposeHeader(header, paper));
                page.Content().Element(content => ComposeContent(content, paper));
                page.Footer().Element(footer => ComposeFooter(footer));
            });
        });

        return document.GeneratePdf();
    }

    private static void ComposeHeader(IContainer container, PaperPdfModel paper)
    {
        var generatedDate = paper.GeneratedAt.ToLocalTime().ToString("dd MMM yyyy", CultureInfo.InvariantCulture);

        container
            .Column(column =>
            {
                column.Spacing(6);

                column.Item()
                    .Text("EXAM PAPER")
                    .FontSize(18)
                    .Bold()
                    .FontColor(Colors.Black);

                column.Item()
                    .Row(row =>
                    {
                        row.RelativeItem().Text(text =>
                        {
                            text.Span("Subject: ").SemiBold();
                            text.Span(paper.SubjectName);
                        });

                        row.RelativeItem().AlignRight().Text(text =>
                        {
                            text.Span("Generated: ").SemiBold();
                            text.Span(generatedDate);
                        });
                    });

                column.Item()
                    .Row(row =>
                    {
                        row.RelativeItem().Text(text =>
                        {
                            text.Span("Total marks: ").SemiBold();
                            text.Span(paper.TotalMarks.ToString(CultureInfo.InvariantCulture));
                        });

                        row.RelativeItem().AlignRight().Text(text =>
                        {
                            text.Span("Questions: ").SemiBold();
                            var totalQuestions = paper.Sections.Sum(section => section.Questions.Count);
                            text.Span(totalQuestions.ToString(CultureInfo.InvariantCulture));
                        });
                    });

                column.Item().PaddingTop(6).LineHorizontal(1).LineColor(Colors.Grey.Lighten1);
            });
    }

    private static void ComposeContent(IContainer container, PaperPdfModel paper)
    {
        container
            .PaddingTop(8)
            .Column(column =>
            {
                column.Spacing(16);

                foreach (var section in paper.Sections)
                {
                    column.Item().Element(item => ComposeSection(item, section));
                }
            });
    }

    private static void ComposeSection(IContainer container, PaperPdfSectionModel section)
    {
        container
            .Column(column =>
            {
                column.Spacing(8);

                column.Item()
                    .PaddingVertical(6)
                    .PaddingHorizontal(10)
                    .Background(Colors.Grey.Lighten3)
                    .Text($"{section.Title} ({section.Questions.Count})")
                    .FontSize(12)
                    .SemiBold();

                column.Item().Table(table =>
                {
                    table.ColumnsDefinition(columns =>
                    {
                        columns.ConstantColumn(28);
                        columns.RelativeColumn();
                        columns.ConstantColumn(44);
                    });

                    table.Header(header =>
                    {
                        header.Cell().PaddingVertical(6).BorderBottom(1).BorderColor(Colors.Grey.Lighten1)
                            .Text("#").SemiBold();
                        header.Cell().PaddingVertical(6).BorderBottom(1).BorderColor(Colors.Grey.Lighten1)
                            .Text("Question").SemiBold();
                        header.Cell().PaddingVertical(6).BorderBottom(1).BorderColor(Colors.Grey.Lighten1)
                            .AlignRight().Text("Marks").SemiBold();
                    });

                    for (var index = 0; index < section.Questions.Count; index++)
                    {
                        var question = section.Questions[index];

                        table.Cell().PaddingVertical(10).Text((index + 1).ToString(CultureInfo.InvariantCulture));
                        table.Cell().PaddingVertical(10).Element(cell => ComposeQuestionCell(cell, question));
                        table.Cell().PaddingVertical(10).AlignRight()
                            .Text(question.Marks.ToString("0.##", CultureInfo.InvariantCulture));
                    }
                });
            });
    }

    private static void ComposeQuestionCell(IContainer container, GeneratedQuestionDto question)
    {
        container.Column(column =>
        {
            column.Spacing(4);

            column.Item().Text(question.Text).FontSize(11);

            if (question.McqOptions is not null)
            {
                column.Item().PaddingTop(2).Text(text =>
                {
                    text.Span("A. ").SemiBold();
                    text.Span(question.McqOptions.OptionA);
                });

                column.Item().Text(text =>
                {
                    text.Span("B. ").SemiBold();
                    text.Span(question.McqOptions.OptionB);
                });

                column.Item().Text(text =>
                {
                    text.Span("C. ").SemiBold();
                    text.Span(question.McqOptions.OptionC);
                });

                column.Item().Text(text =>
                {
                    text.Span("D. ").SemiBold();
                    text.Span(question.McqOptions.OptionD);
                });
            }
            else if (question.TrueFalseAnswer.HasValue)
            {
                column.Item().PaddingTop(2).Text("True / False");
            }
            else if (question.BlankAnswers.Count > 0)
            {
                column.Item().PaddingTop(2).Text(new string('_', 40));
            }
        });
    }

    private static void ComposeFooter(IContainer container)
    {
        container
            .PaddingTop(8)
            .Column(column =>
            {
                column.Item().LineHorizontal(1).LineColor(Colors.Grey.Lighten1);
                column.Item().PaddingTop(6).AlignCenter().Text(text =>
                {
                    text.CurrentPageNumber();
                    text.Span(" / ");
                    text.TotalPages();
                });
            });
    }

}
