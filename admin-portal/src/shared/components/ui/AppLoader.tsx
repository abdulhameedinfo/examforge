import { CircularProgress, Box, Typography, Backdrop } from '@mui/material';
import type { ReactNode } from 'react';

export interface AppLoaderProps {
  size?: number;
  color?: string;
  fullScreen?: boolean;
  message?: string;
  overlay?: boolean;
}

export function AppLoader({
  size = 40,
  color = 'primary',
  fullScreen = false,
  message,
  overlay = false,
}: AppLoaderProps) {
  const content = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
      }}
    >
      <CircularProgress size={size} color={color as any} />
      {message && (
        <Typography variant="body2" color="text.secondary">
          {message}
        </Typography>
      )}
    </Box>
  );

  if (fullScreen) {
    return (
      <Backdrop
        open
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: (theme) => theme.zIndex.modal + 1,
          backgroundColor: overlay ? 'rgba(255, 255, 255, 0.8)' : 'transparent',
        }}
      >
        {content}
      </Backdrop>
    );
  }

  return content;
}
