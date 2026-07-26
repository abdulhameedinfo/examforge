import { Dialog, DialogTitle, DialogContent, DialogActions, DialogProps, IconButton, Typography, Box } from '@mui/material';
import { X } from 'lucide-react';
import type { ReactNode } from 'react';

export interface AppDialogProps extends Omit<DialogProps, 'title'> {
  title?: string;
  content?: ReactNode;
  actions?: ReactNode;
  showCloseButton?: boolean;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
}

export function AppDialog({
  title,
  content,
  actions,
  showCloseButton = true,
  maxWidth = 'sm',
  onClose,
  children,
  ...props
}: AppDialogProps) {
  return (
    <Dialog
      maxWidth={maxWidth}
      onClose={onClose}
      {...props}
    >
      {title && (
        <DialogTitle sx={{ pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6" component="div">
              {title}
            </Typography>
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
        </DialogTitle>
      )}
      <DialogContent sx={{ pt: title ? 1 : 2 }}>
        {content || children}
      </DialogContent>
      {actions && (
        <DialogActions sx={{ px: 3, pb: 2 }}>
          {actions}
        </DialogActions>
      )}
    </Dialog>
  );
}
