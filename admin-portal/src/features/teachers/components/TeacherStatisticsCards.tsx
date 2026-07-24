import { Box, Paper, Skeleton, Stack, Typography } from '@mui/material';
import type { TeacherStatistics } from '../types';

type TeacherStatisticsCardsProps = {
  statistics?: TeacherStatistics;
  loading?: boolean;
};

const metrics = [
  { key: 'totalTeachers', label: 'Total Teachers' },
  { key: 'activeTeachers', label: 'Active Teachers' },
  { key: 'inactiveTeachers', label: 'Inactive Teachers' },
  { key: 'totalSubjectsAssigned', label: 'Subject Assignments' },
  { key: 'totalClassesAssigned', label: 'Class Assignments' },
] as const;

export function TeacherStatisticsCards({ statistics, loading = false }: TeacherStatisticsCardsProps) {
  return (
    <Box
      sx={{
        display: 'grid',
        gap: 2,
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(2, minmax(0, 1fr))',
          lg: 'repeat(5, minmax(0, 1fr))',
        },
      }}
    >
      {metrics.map((metric) => (
        <Paper key={metric.key} variant="outlined" sx={{ p: 2 }}>
          <Stack spacing={0.75}>
            <Typography variant="caption" color="text.secondary">
              {metric.label}
            </Typography>
            {loading ? (
              <Skeleton variant="text" width="60%" height={40} />
            ) : (
              <Typography variant="h5" fontWeight={700}>
                {statistics?.[metric.key] ?? 0}
              </Typography>
            )}
          </Stack>
        </Paper>
      ))}
    </Box>
  );
}
