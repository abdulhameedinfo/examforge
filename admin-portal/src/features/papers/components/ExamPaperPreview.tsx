import {
  Box,
  Chip,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import type { GeneratedExamPaper } from '../types';
import type { QuestionType } from '../../questions/types';

type ExamPaperPreviewProps = {
  paper: GeneratedExamPaper;
};

const questionTypeLabels: Record<string, string> = {
  MultipleChoice: 'MCQ',
  ShortQuestion: 'Short',
  LongQuestion: 'Long',
  FillInTheBlank: 'Fill in Blank',
  TrueFalse: 'True/False',
};

export function ExamPaperPreview({ paper }: ExamPaperPreviewProps) {
  return (
    <Stack spacing={3}>
      <Paper variant="outlined" sx={{ p: 3 }}>
        <Stack spacing={2}>
          <Typography variant="h4" fontWeight={700}>
            Exam Paper
          </Typography>
          
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Subject
              </Typography>
              <Typography variant="body1" fontWeight={600}>
                {paper.subject.name}
              </Typography>
            </Box>
            
            <Box>
              <Typography variant="caption" color="text.secondary">
                Class
              </Typography>
              <Typography variant="body1" fontWeight={600}>
                {paper.class.name}
              </Typography>
            </Box>
            
            <Box>
              <Typography variant="caption" color="text.secondary">
                Total Questions
              </Typography>
              <Typography variant="body1" fontWeight={600}>
                {paper.totalQuestions}
              </Typography>
            </Box>
            
            <Box>
              <Typography variant="caption" color="text.secondary">
                Total Marks
              </Typography>
              <Typography variant="body1" fontWeight={600}>
                {paper.totalMarks}
              </Typography>
            </Box>
            
            <Box>
              <Typography variant="caption" color="text.secondary">
                Generated
              </Typography>
              <Typography variant="body1" fontWeight={600}>
                {new Date(paper.generatedAt).toLocaleString()}
              </Typography>
            </Box>
          </Stack>
        </Stack>
      </Paper>

      <Paper variant="outlined" sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom fontWeight={600}>
          Questions
        </Typography>
        
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: '60px' }}>#</TableCell>
                <TableCell>Question</TableCell>
                <TableCell sx={{ width: '120px' }}>Type</TableCell>
                <TableCell sx={{ width: '100px' }}>Marks</TableCell>
                <TableCell sx={{ width: '120px' }}>Teacher</TableCell>
                <TableCell sx={{ width: '120px' }}>Difficulty</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paper.questions.map((question, index) => (
                <TableRow key={question.id}>
                  <TableCell>
                    <Typography variant="body2" fontWeight={600}>
                      {index + 1}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{question.text}</Typography>
                    {question.chapter && (
                      <Chip
                        label={question.chapter.name}
                        size="small"
                        variant="outlined"
                        sx={{ mt: 0.5, height: 20, fontSize: '0.7rem' }}
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={questionTypeLabels[question.type]}
                      size="small"
                      variant="filled"
                      color="primary"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight={600}>
                      {question.marks}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="caption" color="text.secondary">
                      {question.teacher.name}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={question.difficulty.name}
                      size="small"
                      variant="outlined"
                      sx={{ height: 24, fontSize: '0.75rem' }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {paper.questions.length === 0 && (
          <Box sx={{ py: 6, textAlign: 'center' }}>
            <Typography color="text.secondary">
              No questions were generated. Please check your distribution settings and try again.
            </Typography>
          </Box>
        )}
      </Paper>

      <Paper variant="outlined" sx={{ p: 3, bgcolor: 'info.main', bgcolorOpacity: 0.05 }}>
        <Typography variant="body2" color="text.secondary">
          <strong>Note:</strong> This is a preview of the generated exam paper. The PDF will be generated and available for download from the backend.
        </Typography>
      </Paper>
    </Stack>
  );
}
