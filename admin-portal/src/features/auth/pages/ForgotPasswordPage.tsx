import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Link, Stack, TextField } from '@mui/material';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link as RouterLink } from 'react-router-dom';
import { z } from 'zod';
import { routePaths } from '../../../app/router/routePaths';
import { requestPasswordReset } from '../api/authApi';
import { AuthFormActions } from '../components/AuthFormActions';
import { AuthLayout } from '../components/AuthLayout';

const forgotPasswordSchema = z.object({
  email: z.string().email('Enter a valid email address'),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = handleSubmit(async (values) => {
    setSubmitError(null);

    try {
      await requestPasswordReset(values);
      setSent(true);
    } catch {
      setSubmitError('Unable to send reset instructions right now.');
    }
  });

  return (
    <AuthLayout title="Forgot password" subtitle="Request a reset link for your administrator account.">
      {sent ? (
        <Stack spacing={2.5}>
          <Alert severity="success">If the email exists, a reset link has been sent.</Alert>
          <Link component={RouterLink} to={routePaths.login} underline="hover">
            Back to sign in
          </Link>
        </Stack>
      ) : (
        <form onSubmit={onSubmit} noValidate>
          <Stack spacing={2.5}>
            {submitError ? <Alert severity="error">{submitError}</Alert> : null}

            <TextField
              label="Email"
              type="email"
              autoComplete="email"
              fullWidth
              error={Boolean(errors.email)}
              helperText={errors.email?.message}
              {...register('email')}
            />

            <AuthFormActions
              primaryLabel="Send reset link"
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
