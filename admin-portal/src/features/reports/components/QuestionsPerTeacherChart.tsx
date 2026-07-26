import { BarChart } from '@mui/x-charts/BarChart';
import { Card, CardContent, CardHeader } from '@mui/material';
import { TeacherQuestionCount } from '../types';

interface QuestionsPerTeacherChartProps {
  data: TeacherQuestionCount[];
}

export function QuestionsPerTeacherChart({ data }: QuestionsPerTeacherChartProps) {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardHeader title="Questions per Teacher" titleTypographyProps={{ variant: 'h6', fontWeight: 600 }} />
      <CardContent sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <BarChart
          dataset={data}
          xAxis={[{ scaleType: 'band', dataKey: 'teacherName', label: 'Teacher' }]}
          series={[{ dataKey: 'questionCount', label: 'Questions', color: '#1976d2' }]}
          height={300}
          margin={{ top: 20, right: 30, left: 50, bottom: 50 }}
          sx={{ [`.MuiChartsAxis-label`]: { fill: '#666', fontSize: 12 } }}
        />
      </CardContent>
    </Card>
  );
}
