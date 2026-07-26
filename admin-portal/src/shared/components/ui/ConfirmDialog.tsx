import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box, Alert } from '@mui/material';
import { AlertTriangle } from 'lucide-react';
import type { ReactNode } from 'react';

export interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  severity?: 'info' | 'warning' | 'error';
  icon?: ReactNode;
  loading?: boolean;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
}

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  severity = 'warning',
  icon,
  loading = false,
  maxWidth = 'sm',
}: ConfirmDialogProps) {
  const defaultIcon = icon || <AlertTriangle size={48} />;

  const severityColors = {
    info: 'info.main',
    warning: 'warning.main',
    error: 'error.main',
  };

  return (
    <Dialog open={open} onClose={onCancel} maxWidth={maxWidth}>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ color: severityColors[severity] }}>{defaultIcon}</Box>
          <Typography variant="h6">{title}</Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        {message && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {message}
          </Typography>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onCancel} disabled={loading}>
          {cancelLabel}
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          color={severity === 'error' ? 'error' : severity === 'warning' ? 'warning' : 'primary'}
          disabled={loading}
          autoFocus
        >
          {loading ? 'Processing...' : confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
