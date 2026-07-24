import { Chip } from '@mui/material';

type StatusChipProps = {
  label: string;
  tone?: 'default' | 'success' | 'warning' | 'error' | 'info';
};

export function StatusChip({ label, tone = 'default' }: StatusChipProps) {
  return <Chip label={label} color={tone === 'default' ? undefined : tone} variant="outlined" size="small" />;
}

