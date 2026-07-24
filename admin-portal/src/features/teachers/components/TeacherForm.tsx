import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Box, Button, Stack, Switch, TextField, FormControlLabel } from '@mui/material';
import { useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Link as RouterLink } from 'react-router-dom';
import { z } from 'zod';
import { routePaths } from '../../../app/router/routePaths';
import { AuthFormActions } from '../../auth/components/AuthFormActions';
import { MultiSelectField } from '../../../shared/components/form/MultiSelectField';
import type { IdNameDto } from '../../../shared/api/types';
import {
  getTeacherFormDefaultValues,
  mapTeacherDetailToFormValues,
  mapTeacherFormValuesToPayload,
  teacherFormSchema,
} from '../schemas/teacherSchemas';
import type { TeacherDetail, TeacherUpsertPayload } from '../types';

type TeacherFormProps = {
  submitLabel: string;
  initialTeacher?: TeacherDetail;
  subjects: IdNameDto[];
  classes: IdNameDto[];
  onSubmit: (payload: TeacherUpsertPayload) => Promise<void>;
  submitError?: string | null;
  saving?: boolean;
};

type TeacherFormInput = z.input<typeof teacherFormSchema>;
type TeacherFormOutput = z.output<typeof teacherFormSchema>;

export function TeacherForm({
  submitLabel,
  initialTeacher,
  subjects,
  classes,
  onSubmit,
  submitError,
  saving = false,
}: TeacherFormProps) {
  const defaultValues = useMemo(
    () => mapTeacherDetailToFormValues(initialTeacher),
    [initialTeacher],
  );

  const {
    register,
    control,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<TeacherFormInput, unknown, TeacherFormOutput>({
    resolver: zodResolver(teacherFormSchema),
    defaultValues: getTeacherFormDefaultValues(),
  });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  const submitHandler = handleSubmit(async (values) => {
    await onSubmit(mapTeacherFormValuesToPayload(values));
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
            label="Full Name"
            fullWidth
            error={Boolean(errors.fullName)}
            helperText={errors.fullName?.message}
            {...register('fullName')}
          />

          <TextField
            label="Employee Code"
            fullWidth
            error={Boolean(errors.employeeCode)}
            helperText={errors.employeeCode?.message}
            {...register('employeeCode')}
          />

          <TextField
            label="Email Address"
            fullWidth
            error={Boolean(errors.email)}
            helperText={errors.email?.message}
            {...register('email')}
          />

          <TextField
            label="Phone Number"
            fullWidth
            error={Boolean(errors.phoneNumber)}
            helperText={errors.phoneNumber?.message}
            {...register('phoneNumber')}
          />

          <Box sx={{ gridColumn: { md: '1 / -1' } }}>
            <Controller
              control={control}
              name="subjectIds"
              render={({ field }) => (
                <MultiSelectField
                  label="Assigned Subjects"
                  value={field.value ?? []}
                  options={subjects.map((subject) => ({
                    value: subject.id,
                    label: subject.name,
                  }))}
                  onChange={field.onChange}
                  error={Boolean(errors.subjectIds)}
                  helperText={errors.subjectIds?.message}
                  placeholder="Assign one or more subjects"
                />
              )}
            />
          </Box>

          <Box sx={{ gridColumn: { md: '1 / -1' } }}>
            <Controller
              control={control}
              name="classIds"
              render={({ field }) => (
                <MultiSelectField
                  label="Assigned Classes"
                  value={field.value ?? []}
                  options={classes.map((item) => ({
                    value: item.id,
                    label: item.name,
                  }))}
                  onChange={field.onChange}
                  error={Boolean(errors.classIds)}
                  helperText={errors.classIds?.message}
                  placeholder="Assign one or more classes"
                />
              )}
            />
          </Box>

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
            <Button component={RouterLink} to={routePaths.teachers} variant="text">
              Back to Teachers
            </Button>
          }
        />
      </Stack>
    </form>
  );
}
