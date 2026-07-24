import { CssBaseline, ThemeProvider } from '@mui/material';
import { QueryClientProvider } from '@tanstack/react-query';
import { type PropsWithChildren, useMemo } from 'react';
import { createAppTheme } from '../theme/createAppTheme';
import { queryClient } from '../../shared/api/queryClient';
import { useUiStore } from '../state/useUiStore';

export function AppProviders({ children }: PropsWithChildren) {
  const mode = useUiStore((state) => state.mode);
  const theme = useMemo(() => createAppTheme(mode), [mode]);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline enableColorScheme />
        {children}
      </ThemeProvider>
    </QueryClientProvider>
  );
}

