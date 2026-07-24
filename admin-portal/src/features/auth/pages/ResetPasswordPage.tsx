import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Link, Stack, TextField } from '@mui/material';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { z } from 'zod';
import { routePaths } from '../../../app/router/routePaths';
import { resetPassword } from '../api/authApi';
import { AuthFormActions } from '../components/AuthFormActions';
import { AuthLayout } from '../components/AuthLayout';
import { AuthPasswordField } from '../components/AuthPasswordField';

const resetPasswordSchema = z
  .object({
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(8, 'Confirm the password'),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export function ResetPasswordPage() {
  const params = useParams<{ token: string }>();
  const token = params.token ?? '';
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [completed, setCompleted] = useState(false);

  const hasToken = useMemo(() => token.length > 0, [token]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  const onSubmit = handleSubmit(async (values) => {
    if (!hasToken) {
      setSubmitError('The reset link is missing or invalid.');
      return;
    }

    setSubmitError(null);

    try {
      await resetPassword({ token, password: values.password });
      setCompleted(true);
    } catch {
      setSubmitError('Unable to reset the password right now.');
    }
  });

  return (
    <AuthLayout title="Reset password" subtitle="Create a new administrator password to continue.">
      {!hasToken ? (
        <Stack spacing={2.5}>
          <Alert severity="error">The reset token is missing from the URL.</Alert>
          <Link component={RouterLink} to={routePaths.forgotPassword} underline="hover">
            Request a new reset link
          </Link>
        </Stack>
      ) : completed ? (
        <Stack spacing={2.5}>
          <Alert severity="success">Your password has been updated.</Alert>
          <Link component={RouterLink} to={routePaths.login} underline="hover">
            Back to sign in
          </Link>
        </Stack>
      ) : (
        <form onSubmit={onSubmit} noValidate>
          <Stack spacing={2.5}>
            {submitError ? <Alert severity="error">{submitError}</Alert> : null}

            <AuthPasswordField
              label="New password"
              autoComplete="new-password"
              fullWidth
              error={Boolean(errors.password)}
              helperText={errors.password?.message}
              {...register('password')}
            />

            <TextField
              label="Confirm new password"
              type="password"
              autoComplete="new-password"
              fullWidth
              error={Boolean(errors.confirmPassword)}
              helperText={errors.confirmPassword?.message}
              {...register('confirmPassword')}
            />

            <AuthFormActions
              primaryLabel="Update password"
              submitting={isSubmitting}
              secondaryAction={
                <Link component={RouterLink} to={routePaths.login} underline="hover" variant="body2">
                  Back to sign in
                </Link>
              }
            />
          </Stack>
        </form>
      )}
    </AuthLayout>
  );
}
