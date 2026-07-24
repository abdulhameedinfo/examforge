import { zodResolver } from '@hookform/resolvers/zod';
import {
  Alert,
  Box,
  Button,
  FormControlLabel,
  Stack,
  Switch,
  TextField,
} from '@mui/material';
import { useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { Link as RouterLink } from 'react-router-dom';
import { routePaths } from '../../../app/router/routePaths';
import { AuthFormActions } from '../../auth/components/AuthFormActions';
import { getSubjectFormDefaultValues, mapSubjectDetailToFormValues, mapSubjectFormValuesToPayload, subjectFormSchema } from '../schemas/subjectSchemas';
import type { SubjectDetail, SubjectUpsertPayload } from '../types';

type SubjectFormProps = {
  submitLabel: string;
  initialSubject?: SubjectDetail;
  onSubmit: (payload: SubjectUpsertPayload) => Promise<void>;
  submitError?: string | null;
  saving?: boolean;
};

export function SubjectForm({
  submitLabel,
  initialSubject,
  onSubmit,
  submitError,
  saving = false,
}: SubjectFormProps) {
  const defaultValues = useMemo(
    () => mapSubjectDetailToFormValues(initialSubject),
    [initialSubject],
  );

  type SubjectFormInput = z.input<typeof subjectFormSchema>;
  type SubjectFormOutput = z.output<typeof subjectFormSchema>;

  const {
    register,
    control,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<SubjectFormInput, unknown, SubjectFormOutput>({
    resolver: zodResolver(subjectFormSchema),
    defaultValues: getSubjectFormDefaultValues(),
  });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  const submitHandler = handleSubmit(async (values) => {
    await onSubmit(mapSubjectFormValuesToPayload(values));
  });

  return (
    <form onSubmit={submitHandler} noValidate>
      <Stack spacing={3}>
        {submitError ? <Alert severity="error">{submitError}</Alert> : null}

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
          <TextField
            label="Subject Name"
            fullWidth
            error={Boolean(errors.name)}
            helperText={errors.name?.message}
            {...register('name')}
          />

          <TextField
            label="Subject Code"
            fullWidth
            error={Boolean(errors.code)}
            helperText={errors.code?.message}
            {...register('code')}
          />

          <TextField
            label="Description"
            multiline
            minRows={4}
            fullWidth
            sx={{ gridColumn: { md: '1 / -1' } }}
            error={Boolean(errors.description)}
            helperText={errors.description?.message}
            {...register('description')}
          />

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
        </Box>

        <AuthFormActions
          primaryLabel={submitLabel}
          submitting={saving}
          secondaryAction={
            <Button component={RouterLink} to={routePaths.subjects} variant="text">
              Back to Subjects
            </Button>
          }
        />
      </Stack>
    </form>
  );
}
