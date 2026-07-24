import { Alert, Box, Button, FormControl, InputLabel, MenuItem, Paper, Select, Stack, TextField, Typography } from '@mui/material';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { PageContainer } from '../../../shared/components/PageContainer';
import { SectionHeader } from '../../../shared/components/SectionHeader';
import { DifficultyDistribution } from '../components/DifficultyDistribution';
import { QuestionTypeDistribution } from '../components/QuestionTypeDistribution';
import { TeacherDistribution } from '../components/TeacherDistribution';
import { useGeneratePaperMutation, usePaperFormOptions } from '../hooks/usePaperQueries';
import { examPaperGeneratorSchema, getExamPaperGeneratorDefaultValues, mapFormValuesToPayload } from '../schemas/paperSchemas';
import type { ExamPaperGeneratorFormValues, GeneratedExamPaper } from '../types';
import { ExamPaperPreview } from '../components/ExamPaperPreview';

type ExamPaperGeneratorInput = z.input<typeof examPaperGeneratorSchema>;
type ExamPaperGeneratorOutput = z.output<typeof examPaperGeneratorSchema>;

export function ExamPaperGeneratorPage() {
  const [generatedPaper, setGeneratedPaper] = useState<GeneratedExamPaper | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ExamPaperGeneratorInput, unknown, ExamPaperGeneratorOutput>({
    resolver: zodResolver(examPaperGeneratorSchema),
    defaultValues: getExamPaperGeneratorDefaultValues(),
  });

  const { subjectsQuery, classesQuery, teachersQuery, difficultiesQuery } = usePaperFormOptions();
  const generateMutation = useGeneratePaperMutation();

  const questionTypeDistribution = watch('questionTypeDistribution');
  const teacherDistribution = watch('teacherDistribution');
  const difficultyDistribution = watch('difficultyDistribution');

  const validateBeforeSubmit = (): boolean => {
    const errors: string[] = [];

    const questionTypeTotal = questionTypeDistribution.reduce((sum, item) => sum + item.percentage, 0);
    if (Math.abs(questionTypeTotal - 100) > 0.01) {
      errors.push(`Question type distribution must total 100% (currently ${questionTypeTotal.toFixed(1)}%)`);
    }

    const teacherTotal = teacherDistribution.reduce((sum, item) => sum + item.percentage, 0);
    if (Math.abs(teacherTotal - 100) > 0.01) {
      errors.push(`Teacher distribution must total 100% (currently ${teacherTotal.toFixed(1)}%)`);
    }

    const difficultyTotal = difficultyDistribution.reduce((sum, item) => sum + item.percentage, 0);
    if (Math.abs(difficultyTotal - 100) > 0.01) {
      errors.push(`Difficulty distribution must total 100% (currently ${difficultyTotal.toFixed(1)}%)`);
    }

    setValidationErrors(errors);
    return errors.length === 0;
  };

  const onSubmit = async (values: ExamPaperGeneratorFormValues) => {
    if (!validateBeforeSubmit()) {
      return;
    }

    try {
      const payload = mapFormValuesToPayload(values);
      const result = await generateMutation.mutateAsync(payload);
      setGeneratedPaper(result);
      setValidationErrors([]);
    } catch (error) {
      console.error('Failed to generate exam paper:', error);
    }
  };

  const handleReset = () => {
    setGeneratedPaper(null);
    setValidationErrors([]);
  };

  if (generatedPaper) {
    return (
      <PageContainer>
        <SectionHeader
          title="Exam Paper Preview"
          description="Review the generated exam paper before finalizing."
          actions={
            <Button variant="outlined" onClick={handleReset}>
              Generate New Paper
            </Button>
          }
        />
        <ExamPaperPreview paper={generatedPaper} />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <SectionHeader
        title="Exam Paper Generator"
        description="Configure distribution rules and generate exam papers automatically."
      />

      <Stack spacing={3}>
        {validationErrors.length > 0 && (
          <Alert severity="error">
            <Typography variant="body2" fontWeight={600}>
              Please fix the following errors:
            </Typography>
            <ul style={{ margin: '8px 0 0 0', paddingLeft: '20px' }}>
              {validationErrors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </Alert>
        )}

        {generateMutation.isError && (
          <Alert severity="error">
            Failed to generate exam paper. Please try again or contact support.
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={3}>
            <Paper variant="outlined" sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom fontWeight={600}>
                Basic Information
              </Typography>
              <Box
                sx={{
                  display: 'grid',
                  gap: 2,
                  gridTemplateColumns: {
                    xs: '1fr',
                    md: 'repeat(2, minmax(0, 1fr))',
                  },
                }}
              >
                <Controller
                  control={control}
                  name="subjectId"
                  render={({ field }) => (
                    <FormControl fullWidth size="small" error={Boolean(errors.subjectId)}>
                      <InputLabel>Subject</InputLabel>
                      <Select
                        label="Subject"
                        value={field.value}
                        onChange={field.onChange}
                        disabled={subjectsQuery.isLoading}
                      >
                        {subjectsQuery.data?.map((subject: { id: string; name: string }) => (
                          <MenuItem key={subject.id} value={subject.id}>
                            {subject.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                />

                <Controller
                  control={control}
                  name="classId"
                  render={({ field }) => (
                    <FormControl fullWidth size="small" error={Boolean(errors.classId)}>
                      <InputLabel>Class</InputLabel>
                      <Select
                        label="Class"
                        value={field.value}
                        onChange={field.onChange}
                        disabled={classesQuery.isLoading}
                      >
                        {classesQuery.data?.map((cls: { id: string; name: string }) => (
                          <MenuItem key={cls.id} value={cls.id}>
                            {cls.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                />

                <Controller
                  control={control}
                  name="totalQuestions"
                  render={({ field }) => (
                    <TextField
                      label="Total Questions"
                      type="number"
                      fullWidth
                      size="small"
                      value={field.value}
                      onChange={(e) => field.onChange(Number(e.target.value) || 0)}
                      error={Boolean(errors.totalQuestions)}
                      helperText={errors.totalQuestions?.message}
                      inputProps={{ min: 1, max: 200 }}
                    />
                  )}
                />
              </Box>
            </Paper>

            <Paper variant="outlined" sx={{ p: 3 }}>
              <Controller
                control={control}
                name="questionTypeDistribution"
                render={({ field }) => (
                  <QuestionTypeDistribution
                    distribution={field.value}
                    onChange={field.onChange}
                    error={errors.questionTypeDistribution?.message}
                  />
                )}
              />
            </Paper>

            <Paper variant="outlined" sx={{ p: 3 }}>
              <Controller
                control={control}
                name="teacherDistribution"
                render={({ field }) => (
                  <TeacherDistribution
                    distribution={field.value}
                    availableTeachers={teachersQuery.data ?? []}
                    onChange={field.onChange}
                    error={errors.teacherDistribution?.message}
                  />
                )}
              />
            </Paper>

            <Paper variant="outlined" sx={{ p: 3 }}>
              <Controller
                control={control}
                name="difficultyDistribution"
                render={({ field }) => (
                  <DifficultyDistribution
                    distribution={field.value}
                    availableDifficulties={difficultiesQuery.data ?? []}
                    onChange={field.onChange}
                    error={errors.difficultyDistribution?.message}
                  />
                )}
              />
            </Paper>

            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={generateMutation.isPending}
              >
                {generateMutation.isPending ? 'Generating...' : 'Generate Exam Paper'}
              </Button>
            </Stack>
          </Stack>
        </form>
      </Stack>
    </PageContainer>
  );
}
