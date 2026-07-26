import { Button, ButtonProps, CircularProgress, Box } from '@mui/material';
import type { ReactNode } from 'react';

export interface AppButtonProps extends Omit<ButtonProps, 'startIcon' | 'endIcon'> {
  loading?: boolean;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  fullWidth?: boolean;
}

export function AppButton({
  loading = false,
  disabled,
  startIcon,
  endIcon,
  children,
  fullWidth = false,
  ...props
}: AppButtonProps) {
  return (
    <Button
      disabled={disabled || loading}
      startIcon={!loading ? startIcon : undefined}
      endIcon={!loading ? endIcon : undefined}
      fullWidth={fullWidth}
      {...props}
    >
      {loading ? (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CircularProgress size={16} color="inherit" />
          {children}
        </Box>
      ) : (
        children
      )}
    </Button>
  );
}
