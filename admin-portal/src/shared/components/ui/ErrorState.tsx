import { Box, Button, Paper, Stack, Typography, Alert, AlertTitle } from '@mui/material';
import { AlertCircle, RefreshCw } from 'lucide-react';
import type { ReactNode } from 'react';

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  actionLabel?: string;
  onAction?: () => void;
  icon?: ReactNode;
  variant?: 'outlined' | 'elevated';
  severity?: 'error' | 'warning';
}

export function ErrorState({
  title = 'Something went wrong',
  message = 'An error occurred while loading the data. Please try again.',
  onRetry,
  actionLabel,
  onAction,
  icon,
  variant = 'outlined',
  severity = 'error',
}: ErrorStateProps) {
  const defaultIcon = icon || <AlertCircle size={48} />;

  return (
    <Paper
      variant={variant}
      sx={{
        p: 3,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 200,
      }}
    >
      <Stack spacing={3} alignItems="center" textAlign="center" maxWidth={400}>
        <Box sx={{ color: severity === 'error' ? 'error.main' : 'warning.main', fontSize: 48 }}>
          {defaultIcon}
        </Box>
        <Box>
          <Typography variant="h6" fontWeight={500}>
            {title}
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 1 }} variant="body2">
            {message}
          </Typography>
        </Box>
        <Stack direction="row" spacing={2}>
          {onRetry && (
            <Button
              variant="outlined"
              onClick={onRetry}
              startIcon={<RefreshCw size={16} />}
            >
              Retry
            </Button>
          )}
          {actionLabel && onAction && (
            <Button variant="contained" onClick={onAction}>
              {actionLabel}
            </Button>
          )}
        </Stack>
      </Stack>
    </Paper>
  );
}
