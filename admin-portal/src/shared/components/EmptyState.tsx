import { Box, Button, Paper, Stack, Typography } from '@mui/material';
import type { ReactNode } from 'react';

type EmptyStateProps = {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: ReactNode;
};

export function EmptyState({ title, description, actionLabel, onAction, icon }: EmptyStateProps) {
  return (
    <Paper variant="outlined" sx={{ p: 3 }}>
      <Stack spacing={2} alignItems="flex-start">
        {icon ? <Box sx={{ color: 'text.secondary' }}>{icon}</Box> : null}
        <Box>
          <Typography variant="h6">{title}</Typography>
          {description ? (
            <Typography color="text.secondary" sx={{ mt: 0.5 }}>
              {description}
            </Typography>
          ) : null}
        </Box>
        {actionLabel && onAction ? (
          <Button variant="contained" onClick={onAction}>
            {actionLabel}
          </Button>
        ) : null}
      </Stack>
    </Paper>
  );
}

