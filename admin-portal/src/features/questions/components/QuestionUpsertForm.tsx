import { zodResolver } from '@hookform/resolvers/zod';
import {
  Alert,
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  IconButton,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import { Plus, Trash2 } from 'lucide-react';
import { useEffect, useMemo, type ReactNode } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { Link as RouterLink } from 'react-router-dom';
import { z } from 'zod';
import { routePaths } from '../../../app/router/routePaths';
import { AuthFormActions } from '../../auth/components/AuthFormActions';
import { questionTypeOptions } from '../types';
import { useQuestionFormOptions } from '../hooks/useQuestionQueries';
import {
  getQuestionFormDefaultValues,
  mapQuestionDetailToFormValues,
  mapQuestionFormValuesToPayload,
  questionFormSchema,
} from '../schemas/questionSchemas';
import type { QuestionDetail, QuestionFormValues, QuestionUpsertPayload } from '../types';

type QuestionUpsertFormProps = {
  submitLabel: string;
  initialQuestion?: QuestionDetail;
  onSubmit: (payload: QuestionUpsertPayload) => Promise<void>;
  submitError?: string | null;
  saving?: boolean;
};

function FormSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Stack spacing={2}>
      <Typography variant="h6">{title}</Typography>
      {children}
    </Stack>
  );
}

export function QuestionUpsertForm({
  submitLabel,
  initialQuestion,
  onSubmit,
  submitError,
  saving = false,
}: QuestionUpsertFormProps) {
  const defaultValues = useMemo(
    () => mapQuestionDetailToFormValues(initialQuestion),
    [initialQuestion],
  );

  type QuestionFormInput = z.input<typeof questionFormSchema>;
  type QuestionFormOutput = z.output<typeof questionFormSchema>;

  const {
    register,
    control,
    reset,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<QuestionFormInput, unknown, QuestionFormOutput>({
    resolver: zodResolver(questionFormSchema),
    defaultValues: getQuestionFormDefaultValues(),
  });

  const type = useWatch({ control, name: 'type' });
  const subjectId = useWatch({ control, name: 'subjectId' });
  const blankAnswers = useWatch({ control, name: 'blankAnswers' }) ?? [];
  const { subjectsQuery, chaptersQuery, difficultiesQuery, teachersQuery } = useQuestionFormOptions(subjectId);
  const mcqErrors = errors as Partial<Record<'mcqOptionA' | 'mcqOptionB' | 'mcqOptionC' | 'mcqOptionD', { message?: string }>>;

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  useEffect(() => {
    if (!subjectId) {
      setValue('chapterId', '');
    }
  }, [setValue, subjectId]);

  const submitHandler = handleSubmit(async (values) => {
    await onSubmit(mapQuestionFormValuesToPayload(values as unknown as QuestionFormValues));
  });

  return (
    <form onSubmit={submitHandler} noValidate>
      <Stack spacing={3}>
        {submitError ? <Alert severity="error">{submitError}</Alert> : null}

        <FormSection title="Question Details">
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
            <FormControl fullWidth error={Boolean(errors.subjectId)}>
              <InputLabel id="question-subject-label">Subject</InputLabel>
              <Controller
                control={control}
                name="subjectId"
                render={({ field }) => (
                  <Select {...field} labelId="question-subject-label" label="Subject">
                    <MenuItem value="">Select subject</MenuItem>
                    {subjectsQuery.data?.map((subject) => (
                      <MenuItem key={subject.id} value={subject.id}>
                        {subject.name}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
            </FormControl>

            <FormControl fullWidth error={Boolean(errors.chapterId)}>
              <InputLabel id="question-chapter-label">Chapter</InputLabel>
              <Controller
                control={control}
                name="chapterId"
                render={({ field }) => (
                  <Select {...field} labelId="question-chapter-label" label="Chapter">
                    <MenuItem value="">Select chapter</MenuItem>
                    {chaptersQuery.data?.map((chapter) => (
                      <MenuItem key={chapter.id} value={chapter.id}>
                        {chapter.name}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
            </FormControl>

            <FormControl fullWidth error={Boolean(errors.teacherId)}>
              <InputLabel id="question-teacher-label">Teacher</InputLabel>
              <Controller
                control={control}
                name="teacherId"
                render={({ field }) => (
                  <Select {...field} labelId="question-teacher-label" label="Teacher">
                    <MenuItem value="">Select teacher</MenuItem>
                    {teachersQuery.data?.map((teacher) => (
                      <MenuItem key={teacher.id} value={teacher.id}>
                        {teacher.fullName}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
            </FormControl>

            <FormControl fullWidth error={Boolean(errors.difficultyId)}>
              <InputLabel id="question-difficulty-label">Difficulty</InputLabel>
              <Controller
                control={control}
                name="difficultyId"
                render={({ field }) => (
                  <Select {...field} labelId="question-difficulty-label" label="Difficulty">
                    <MenuItem value="">Select difficulty</MenuItem>
                    {difficultiesQuery.data?.map((difficulty) => (
                      <MenuItem key={difficulty.id} value={difficulty.id}>
                        {difficulty.name}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
            </FormControl>

            <FormControl fullWidth error={Boolean(errors.type)}>
              <InputLabel id="question-type-label">Question Type</InputLabel>
              <Controller
                control={control}
                name="type"
                render={({ field }) => (
                  <Select {...field} labelId="question-type-label" label="Question Type">
                    {questionTypeOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
            </FormControl>

            <Controller
              control={control}
              name="isActive"
              render={({ field }) => (
                <FormControlLabel
                  control={<Switch checked={field.value} onChange={(_, checked) => field.onChange(checked)} />}
                  label="Active"
                />
              )}
            />

            <TextField
              label="Marks"
              type="number"
              inputProps={{ min: 0.5, step: 0.5 }}
              fullWidth
              error={Boolean(errors.marks)}
              helperText={errors.marks?.message}
              {...register('marks')}
            />
          </Box>

          <TextField
            label="Question Text"
            multiline
            minRows={4}
            fullWidth
            error={Boolean(errors.text)}
            helperText={errors.text?.message}
            {...register('text')}
          />
        </FormSection>

        {type === 'MultipleChoice' ? (
          <FormSection title="MCQ Options">
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
              {(['A', 'B', 'C', 'D'] as const).map((option) => (
                <TextField
                  key={option}
                  label={`Option ${option}`}
                  fullWidth
                  error={Boolean(mcqErrors[`mcqOption${option}` as keyof typeof mcqErrors])}
                  helperText={mcqErrors[`mcqOption${option}` as keyof typeof mcqErrors]?.message}
                  {...register(`mcqOption${option}` as const)}
                />
              ))}

              <FormControl fullWidth>
                <InputLabel id="mcq-correct-option-label">Correct Option</InputLabel>
                <Controller
                  control={control}
                  name="mcqCorrectOption"
                  render={({ field }) => (
                    <Select {...field} labelId="mcq-correct-option-label" label="Correct Option">
                      {(['A', 'B', 'C', 'D'] as const).map((option) => (
                        <MenuItem key={option} value={option}>
                          Option {option}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
              </FormControl>
            </Box>
          </FormSection>
        ) : null}

        {type === 'TrueFalse' ? (
          <FormSection title="True / False Answer">
            <Controller
              control={control}
              name="trueFalseAnswer"
              render={({ field }) => (
                <FormControl error={Boolean(errors.trueFalseAnswer)}>
                  <FormLabel>Correct answer</FormLabel>
                  <RadioGroup
                    row
                    value={field.value === null ? '' : String(field.value)}
                    onChange={(event) => field.onChange(event.target.value === 'true')}
                  >
                    <FormControlLabel value="true" control={<Radio />} label="True" />
                    <FormControlLabel value="false" control={<Radio />} label="False" />
                  </RadioGroup>
                </FormControl>
              )}
            />
          </FormSection>
        ) : null}

        {(type === 'ShortQuestion' || type === 'LongQuestion') ? (
          <FormSection title="Model Answer">
            <TextField
              label="Model Answer"
              multiline
              minRows={4}
              fullWidth
              error={Boolean(errors.modelAnswer)}
              helperText={errors.modelAnswer?.message}
              {...register('modelAnswer')}
            />
          </FormSection>
        ) : null}

        {type === 'FillInTheBlank' ? (
          <FormSection title="Blank Answers">
            <Stack spacing={2}>
              {blankAnswers.map((_, index) => (
                <Stack key={index} direction="row" spacing={1.5} alignItems="flex-start">
                  <TextField
                    label={`Answer ${index + 1}`}
                    fullWidth
                    error={Boolean(errors.blankAnswers?.[index])}
                    helperText={errors.blankAnswers?.[index]?.message}
                    {...register(`blankAnswers.${index}` as const)}
                  />
                  <IconButton
                    aria-label={`Remove answer ${index + 1}`}
                    onClick={() => {
                      const nextAnswers = blankAnswers.filter((_, currentIndex) => currentIndex !== index);
                      setValue('blankAnswers', nextAnswers.length > 0 ? nextAnswers : ['']);
                    }}
                    disabled={blankAnswers.length === 1}
                  >
                    <Trash2 size={18} />
                  </IconButton>
                </Stack>
              ))}

              <Button
                type="button"
                variant="outlined"
                startIcon={<Plus size={18} />}
                onClick={() => setValue('blankAnswers', [...blankAnswers, ''])}
                sx={{ alignSelf: 'flex-start' }}
              >
                Add Answer
              </Button>
            </Stack>
          </FormSection>
        ) : null}

        <AuthFormActions
          primaryLabel={submitLabel}
          submitting={saving}
          secondaryAction={
            <Button component={RouterLink} to={routePaths.questions} variant="text">
              Back to Questions
            </Button>
          }
        />
      </Stack>
    </form>
  );
}
