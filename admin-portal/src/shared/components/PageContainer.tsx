import { Box, Container } from '@mui/material';
import type { PropsWithChildren } from 'react';

type PageContainerProps = PropsWithChildren<{
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | false;
}>;

export function PageContainer({ children, maxWidth = 'xl' }: PageContainerProps) {
  return (
    <Container maxWidth={maxWidth} disableGutters>
      <Box sx={{ display: 'grid', gap: 2 }}>{children}</Box>
    </Container>
  );
}

