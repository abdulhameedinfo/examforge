import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Checkbox, FormControlLabel, Link, Stack, TextField } from '@mui/material';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { routePaths } from '../../../app/router/routePaths';
import { AuthFormActions } from '../components/AuthFormActions';
import { AuthLayout } from '../components/AuthLayout';
import { AuthPasswordField } from '../components/AuthPasswordField';
import { login } from '../api/authApi';
import { useAuthStore } from '../store/useAuthStore';

const loginSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  rememberMe: z.boolean(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const setSession = useAuthStore((state) => state.setSession);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: true,
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    setSubmitError(null);

    try {
      const session = await login(values);

      if (session.user.role !== 'Administrator') {
        setSubmitError('Only administrators can access the web portal.');
        return;
      }

      setSession(session);

      const fromPath = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname;
      navigate(fromPath ?? routePaths.dashboard, { replace: true });
    } catch {
      setSubmitError('Unable to sign in. Check your credentials and try again.');
    }
  });

  return (
    <AuthLayout title="Sign in" subtitle="Use your administrator account to access ExamForge.">
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

          <AuthPasswordField
            label="Password"
            autoComplete="current-password"
            fullWidth
            error={Boolean(errors.password)}
            helperText={errors.password?.message}
            {...register('password')}
          />

          <FormControlLabel
            control={<Checkbox {...register('rememberMe')} defaultChecked />}
            label="Keep me signed in"
          />

          <AuthFormActions
            primaryLabel="Sign in"
            submitting={isSubmitting}
            secondaryAction={
              <Link component={RouterLink} to={routePaths.forgotPassword} underline="hover" variant="body2">
                Forgot password?
              </Link>
            }
          />
        </Stack>
      </form>
    </AuthLayout>
  );
}
