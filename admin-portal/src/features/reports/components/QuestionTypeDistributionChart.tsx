import { PieChart } from '@mui/x-charts/PieChart';
import { Card, CardContent, CardHeader } from '@mui/material';
import { QuestionTypeDistribution } from '../types';

interface QuestionTypeDistributionChartProps {
  data: QuestionTypeDistribution[];
}

export function QuestionTypeDistributionChart({ data }: QuestionTypeDistributionChartProps) {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardHeader title="Question Types Distribution" titleTypographyProps={{ variant: 'h6', fontWeight: 600 }} />
      <CardContent sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <PieChart
          series={[
            {
              data: data.map((item) => ({
                id: item.type,
                value: item.count,
                label: item.label,
              })),
              innerRadius: 60,
              outerRadius: 100,
              paddingAngle: 2,
              cornerRadius: 4,
              cx: '50%',
              cy: '50%',
            },
          ]}
          height={300}
          slotProps={{
            legend: {
              direction: 'row',
              position: { vertical: 'bottom', horizontal: 'middle' },
              padding: 0,
              labelStyle: {
                fontSize: 11,
              },
            },
          }}
        />
      </CardContent>
    </Card>
  );
}
