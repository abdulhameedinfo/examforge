import { Card, CardProps, CardHeader, CardContent, CardActions, Typography, Box } from '@mui/material';
import type { ReactNode } from 'react';

export interface AppCardProps extends Omit<CardProps, 'title'> {
  title?: string;
  subheader?: string;
  content?: ReactNode;
  actions?: ReactNode;
  avatar?: ReactNode;
}

export function AppCard({
  title,
  subheader,
  content,
  actions,
  avatar,
  children,
  ...props
}: AppCardProps) {
  return (
    <Card {...props}>
      {(title || subheader || avatar) && (
        <CardHeader
          avatar={avatar}
          title={
            title ? (
              <Typography variant="h6" fontWeight={600}>
                {title}
              </Typography>
            ) : null
          }
          subheader={subheader}
        />
      )}
      <CardContent>{content || children}</CardContent>
      {actions && <CardActions>{actions}</CardActions>}
    </Card>
  );
}
