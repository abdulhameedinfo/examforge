import { BarChart } from '@mui/x-charts/BarChart';
import { Card, CardContent, CardHeader } from '@mui/material';
import { DifficultyDistribution } from '../types';

interface DifficultyDistributionChartProps {
  data: DifficultyDistribution[];
}

export function DifficultyDistributionChart({ data }: DifficultyDistributionChartProps) {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardHeader title="Difficulty Distribution" titleTypographyProps={{ variant: 'h6', fontWeight: 600 }} />
      <CardContent sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <BarChart
          dataset={data}
          xAxis={[{ scaleType: 'band', dataKey: 'difficultyName', label: 'Difficulty' }]}
          series={[{ dataKey: 'count', label: 'Questions' }]}
          height={300}
          margin={{ top: 20, right: 30, left: 50, bottom: 50 }}
          colors={['#4caf50', '#ff9800', '#f44336']}
          sx={{ [`.MuiChartsAxis-label`]: { fill: '#666', fontSize: 12 } }}
        />
      </CardContent>
    </Card>
  );
}
