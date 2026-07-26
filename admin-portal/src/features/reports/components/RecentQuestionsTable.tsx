import { Card, CardContent, CardHeader, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Chip } from '@mui/material';
import { RecentQuestion } from '../types';

interface RecentQuestionsTableProps {
  data: RecentQuestion[];
}

const questionTypeColors: Record<string, { color: string; label: string }> = {
  MultipleChoice: { color: '#1976d2', label: 'MCQ' },
  ShortQuestion: { color: '#388e3c', label: 'Short' },
  LongQuestion: { color: '#f57c00', label: 'Long' },
  FillInTheBlank: { color: '#7b1fa2', label: 'Fill' },
  TrueFalse: { color: '#d32f2f', label: 'T/F' },
};

export function RecentQuestionsTable({ data }: RecentQuestionsTableProps) {
  return (
    <Card>
      <CardHeader title="Recently Added Questions" titleTypographyProps={{ variant: 'h6', fontWeight: 600 }} />
      <CardContent>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Question</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Subject</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Teacher</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Difficulty</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Created</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((question) => (
                <TableRow key={question.id} hover>
                  <TableCell>
                    <Typography variant="body2" noWrap sx={{ maxWidth: 250 }}>
                      {question.text}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={questionTypeColors[question.type]?.label || question.type}
                      size="small"
                      sx={{
                        backgroundColor: questionTypeColors[question.type]?.color || '#757575',
                        color: 'white',
                        fontSize: '0.75rem',
                        height: 24,
                      }}
                    />
                  </TableCell>
                  <TableCell>{question.subject}</TableCell>
                  <TableCell>{question.teacher}</TableCell>
                  <TableCell>{question.difficulty}</TableCell>
                  <TableCell>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(question.createdAt).toLocaleDateString()}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
}
