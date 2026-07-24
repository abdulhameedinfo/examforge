import { Box, Stack, Typography } from '@mui/material';
import type { ReactNode } from 'react';

type SectionHeaderProps = {
  title: string;
  description?: string;
  actions?: ReactNode;
};

export function SectionHeader({ title, description, actions }: SectionHeaderProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: { xs: 'flex-start', sm: 'center' },
        justifyContent: 'space-between',
        gap: 2,
        flexDirection: { xs: 'column', sm: 'row' },
      }}
    >
      <Stack spacing={0.5}>
        <Typography variant="h4">{title}</Typography>
        {description ? <Typography color="text.secondary">{description}</Typography> : null}
      </Stack>
      {actions}
    </Box>
  );
}

