import { Box, Button, Stack } from '@mui/material';
import type { PropsWithChildren, ReactNode } from 'react';

type AuthFormActionsProps = PropsWithChildren<{
  primaryLabel: string;
  secondaryAction?: ReactNode;
  submitting?: boolean;
}>;

export function AuthFormActions({ primaryLabel, secondaryAction, submitting, children }: AuthFormActionsProps) {
  return (
    <Stack spacing={2}>
      {children}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
        {secondaryAction}
        <Button type="submit" variant="contained" size="large" disabled={submitting} sx={{ minWidth: 160, ml: 'auto' }}>
          {primaryLabel}
        </Button>
      </Box>
    </Stack>
  );
}
