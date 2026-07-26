import { Drawer, DrawerProps, Box, Typography, IconButton, Toolbar } from '@mui/material';
import { X } from 'lucide-react';
import type { ReactNode } from 'react';

export interface AppDrawerProps extends Omit<DrawerProps, 'title'> {
  title?: string;
  content?: ReactNode;
  actions?: ReactNode;
  showCloseButton?: boolean;
  width?: number | string;
}

export function AppDrawer({
  title,
  content,
  actions,
  showCloseButton = true,
  width = 400,
  onClose,
  children,
  ...props
}: AppDrawerProps) {
  return (
    <Drawer
      anchor="right"
      onClose={onClose}
      PaperProps={{ sx: { width } }}
      {...props}
    >
      <Toolbar sx={{ px: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          {title && (
            <Typography variant="h6" component="div">
              {title}
            </Typography>
          )}
          {showCloseButton && (
            <IconButton
              edge="end"
              onClick={(e) => onClose?.(e, 'escapeKeyDown')}
              size="small"
            >
              <X size={20} />
            </IconButton>
          )}
        </Box>
      </Toolbar>
      <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
        {content || children}
      </Box>
      {actions && (
        <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
          {actions}
        </Box>
      )}
    </Drawer>
  );
}
