import { Box, Paper, Stack, Typography, useMediaQuery, useTheme } from '@mui/material';
import type { PropsWithChildren } from 'react';
import { ShieldCheck, Sparkles } from 'lucide-react';
import { appEnv } from '../../../app/config/env';

type AuthLayoutProps = PropsWithChildren<{
  title: string;
  subtitle: string;
}>;

export function AuthLayout({ title, subtitle, children }: AuthLayoutProps) {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'grid',
        gridTemplateColumns: isDesktop ? '1.1fr 0.9fr' : '1fr',
        bgcolor: 'background.default',
      }}
    >
      {isDesktop ? (
        <Box
          sx={{
            p: { md: 6, lg: 8 },
            display: 'flex',
            alignItems: 'center',
            background: theme.palette.mode === 'light' ? '#0F4C81' : '#0B1220',
            color: '#fff',
          }}
        >
          <Stack spacing={4} maxWidth={560}>
            <Stack spacing={1.5}>
              <Typography variant="overline" sx={{ letterSpacing: 1, color: 'rgba(255,255,255,0.72)' }}>
                ExamForge Admin Portal
              </Typography>
              <Typography variant="h2" fontWeight={700} lineHeight={1.05}>
                {appEnv.appName}
              </Typography>
              <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.82)' }}>
                Offline-first administration for schools and colleges.
              </Typography>
            </Stack>

            <Stack spacing={2}>
              {[
                'Manage question banks, papers, teachers, and reports in one place.',
                'Secure administrator access with JWT and token refresh support.',
                'Responsive workflows designed for day-to-day school operations.',
              ].map((item) => (
                <Stack key={item} direction="row" spacing={1.5} alignItems="flex-start">
                  <Sparkles size={18} style={{ marginTop: 2, flexShrink: 0 }} />
                  <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.85)' }}>
                    {item}
                  </Typography>
                </Stack>
              ))}
            </Stack>

            <Stack direction="row" spacing={1.5} alignItems="center">
              <ShieldCheck size={20} />
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                Administrator access only
              </Typography>
            </Stack>
          </Stack>
        </Box>
      ) : null}

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', p: { xs: 2, sm: 3, md: 4 } }}>
        <Paper
          elevation={0}
          variant="outlined"
          sx={{
            width: '100%',
            maxWidth: 520,
            p: { xs: 3, sm: 4 },
            borderColor: 'divider',
          }}
        >
          <Stack spacing={3}>
            <Stack spacing={0.5}>
              <Typography variant="h4" fontWeight={700}>
                {title}
              </Typography>
              <Typography color="text.secondary">{subtitle}</Typography>
            </Stack>
            {children}
          </Stack>
        </Paper>
      </Box>
    </Box>
  );
}

