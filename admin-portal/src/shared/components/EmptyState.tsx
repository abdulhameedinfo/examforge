import { Box, Button, Paper, Stack, Typography, CircularProgress } from '@mui/material';
import type { ReactNode } from 'react';

export interface EmptyStateProps {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: ReactNode;
  loading?: boolean;
  variant?: 'outlined' | 'elevated';
  size?: 'small' | 'medium' | 'large';
}

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  icon,
  loading = false,
  variant = 'outlined',
  size = 'medium',
}: EmptyStateProps) {
  const sizeStyles = {
    small: { p: 2, iconSize: 32 },
    medium: { p: 3, iconSize: 48 },
    large: { p: 4, iconSize: 64 },
  };

  const { p, iconSize } = sizeStyles[size];

  return (
    <Paper
      variant={variant}
      sx={{
        p,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: size === 'large' ? 300 : size === 'medium' ? 200 : 150,
      }}
    >
      <Stack spacing={2} alignItems="center" textAlign="center" maxWidth={400}>
        {loading ? (
          <CircularProgress size={iconSize} color="primary" />
        ) : icon ? (
          <Box sx={{ color: 'text.secondary', fontSize: iconSize }}>{icon}</Box>
        ) : null}
        <Box>
          <Typography variant={size === 'large' ? 'h5' : size === 'medium' ? 'h6' : 'body1'} fontWeight={500}>
            {title}
          </Typography>
          {description ? (
            <Typography color="text.secondary" sx={{ mt: 1 }} variant="body2">
              {description}
            </Typography>
          ) : null}
        </Box>
        {actionLabel && onAction && !loading ? (
          <Button variant="contained" onClick={onAction}>
            {actionLabel}
          </Button>
        ) : null}
      </Stack>
    </Paper>
  );
}

