import { Box, Paper, Skeleton, Stack, Typography } from '@mui/material';

export type QuestionStatistics = {
  totalQuestions: number;
  activeQuestions: number;
  inactiveQuestions: number;
  totalByType: Record<string, number>;
  totalByDifficulty: Record<string, number>;
  totalBySubject: Record<string, number>;
  averageMarks: number;
};

type QuestionStatisticsCardsProps = {
  statistics?: QuestionStatistics;
  loading?: boolean;
};

const metrics = [
  { key: 'totalQuestions', label: 'Total Questions', format: (value: number) => String(value) },
  { key: 'activeQuestions', label: 'Active Questions', format: (value: number) => String(value) },
  { key: 'inactiveQuestions', label: 'Inactive Questions', format: (value: number) => String(value) },
  { key: 'averageMarks', label: 'Average Marks', format: (value: number) => value.toFixed(1) },
] as const;

export function QuestionStatisticsCards({ statistics, loading = false }: QuestionStatisticsCardsProps) {
  return (
    <Stack spacing={3}>
      <Box
        sx={{
          display: 'grid',
          gap: 2,
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, minmax(0, 1fr))',
            lg: 'repeat(4, minmax(0, 1fr))',
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
                  {metric.format ? metric.format(statistics?.[metric.key] ?? 0) : (statistics?.[metric.key] ?? 0)}
                </Typography>
              )}
            </Stack>
          </Paper>
        ))}
      </Box>

      {statistics && !loading && (
        <Box
          sx={{
            display: 'grid',
            gap: 2,
            gridTemplateColumns: {
              xs: '1fr',
              md: 'repeat(3, minmax(0, 1fr))',
            },
          }}
        >
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
              By Type
            </Typography>
            <Stack spacing={0.5}>
              {Object.entries(statistics.totalByType).map(([type, count]) => (
                <Stack key={type} direction="row" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">
                    {type}
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {count}
                  </Typography>
                </Stack>
              ))}
              {Object.keys(statistics.totalByType).length === 0 && (
                <Typography variant="body2" color="text.secondary">
                  No data
                </Typography>
              )}
            </Stack>
          </Paper>

          <Paper variant="outlined" sx={{ p: 2 }}>
            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
              By Difficulty
            </Typography>
            <Stack spacing={0.5}>
              {Object.entries(statistics.totalByDifficulty).map(([difficulty, count]) => (
                <Stack key={difficulty} direction="row" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">
                    {difficulty}
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {count}
                  </Typography>
                </Stack>
              ))}
              {Object.keys(statistics.totalByDifficulty).length === 0 && (
                <Typography variant="body2" color="text.secondary">
                  No data
                </Typography>
              )}
            </Stack>
          </Paper>

          <Paper variant="outlined" sx={{ p: 2 }}>
            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
              By Subject
            </Typography>
            <Stack spacing={0.5}>
              {Object.entries(statistics.totalBySubject).map(([subject, count]) => (
                <Stack key={subject} direction="row" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">
                    {subject}
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {count}
                  </Typography>
                </Stack>
              ))}
              {Object.keys(statistics.totalBySubject).length === 0 && (
                <Typography variant="body2" color="text.secondary">
                  No data
                </Typography>
              )}
            </Stack>
          </Paper>
        </Box>
      )}
    </Stack>
  );
}
