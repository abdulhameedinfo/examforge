import { Card, CardContent, CardHeader, Box, Typography, CircularProgress } from '@mui/material';
import { CheckCircle, Sync, AlertCircle } from 'lucide-react';
import { SyncStatus } from '../types';

interface SyncStatusCardProps {
  data: SyncStatus;
}

export function SyncStatusCard({ data }: SyncStatusCardProps) {
  const getStatusConfig = () => {
    switch (data.status) {
      case 'synced':
        return {
          icon: <CheckCircle size={20} />,
          color: '#4caf50',
          label: 'Synced',
          bgColor: '#e8f5e9',
        };
      case 'syncing':
        return {
          icon: <Sync size={20} />,
          color: '#1976d2',
          label: 'Syncing',
          bgColor: '#e3f2fd',
        };
      case 'error':
        return {
          icon: <AlertCircle size={20} />,
          color: '#f44336',
          label: 'Error',
          bgColor: '#ffebee',
        };
    }
  };

  const config = getStatusConfig();

  return (
    <Card>
      <CardHeader title="Sync Status" titleTypographyProps={{ variant: 'h6', fontWeight: 600 }} />
      <CardContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 48,
                height: 48,
                borderRadius: '50%',
                backgroundColor: config.bgColor,
                color: config.color,
              }}
            >
              {data.status === 'syncing' ? <CircularProgress size={24} color="inherit" /> : config.icon}
            </Box>
            <Box>
              <Typography variant="h6" fontWeight={600} sx={{ color: config.color }}>
                {config.label}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {data.pendingChanges > 0 ? `${data.pendingChanges} pending changes` : 'All changes synced'}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Last sync:
            </Typography>
            <Typography variant="body2" fontWeight={500}>
              {new Date(data.lastSyncTime).toLocaleString()}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
