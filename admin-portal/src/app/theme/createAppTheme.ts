import { createTheme } from '@mui/material';
import type { ThemeMode } from '../state/useUiStore';

export function createAppTheme(mode: ThemeMode) {
  return createTheme({
    palette: {
      mode,
      primary: {
        main: mode === 'light' ? '#0F4C81' : '#7CB9E8',
      },
      secondary: {
        main: mode === 'light' ? '#8B5CF6' : '#A78BFA',
      },
      success: {
        main: '#0F766E',
      },
      warning: {
        main: '#B45309',
      },
      error: {
        main: '#B91C1C',
      },
      background: {
        default: mode === 'light' ? '#F7F9FC' : '#0B1220',
        paper: mode === 'light' ? '#FFFFFF' : '#111827',
      },
      text: {
        primary: mode === 'light' ? '#0F172A' : '#E5E7EB',
        secondary: mode === 'light' ? '#475569' : '#9CA3AF',
      },
    },
    shape: {
      borderRadius: 8,
    },
    typography: {
      fontFamily: [
        'Inter',
        'system-ui',
        '-apple-system',
        'BlinkMacSystemFont',
        'Segoe UI',
        'sans-serif',
      ].join(','),
      button: {
        textTransform: 'none',
        fontWeight: 600,
      },
    },
    components: {
      MuiAppBar: {
        styleOverrides: {
          root: {
            boxShadow: 'none',
            borderBottom: '1px solid',
            borderColor: 'rgba(148, 163, 184, 0.16)',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            border: '1px solid',
            borderColor: 'rgba(148, 163, 184, 0.16)',
          },
        },
      },
    },
  });
}

