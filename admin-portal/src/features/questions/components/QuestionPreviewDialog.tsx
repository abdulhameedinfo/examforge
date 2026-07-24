import {
  Box,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from '@mui/material';
import type { QuestionDetail } from '../types';
import { QuestionTypeChip } from './QuestionTypeChip';

type QuestionPreviewDialogProps = {
  question: QuestionDetail | null;
  open: boolean;
  onClose: () => void;
};

export function QuestionPreviewDialog({ question, open, onClose }: QuestionPreviewDialogProps) {
  if (!question) {
    return null;
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Question Preview</DialogTitle>
      <DialogContent>
        <Stack spacing={3}>
          <Box>
            <Typography variant="h6" gutterBottom fontWeight={600}>
              {question.text}
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mt: 1 }}>
              <QuestionTypeChip type={question.type} />
              {question.difficulty && (
                <Chip label={question.difficulty.name} size="small" variant="outlined" />
              )}
              <Chip label={`${question.marks} marks`} size="small" variant="outlined" />
            </Stack>
          </Box>

          <Stack spacing={2}>
            <Typography variant="subtitle2" fontWeight={600}>
              Details
            </Typography>
            <Stack spacing={1}>
              <Typography variant="body2" color="text.secondary">
                <strong>Subject:</strong> {question.subject.name}
              </Typography>
              {question.chapter && (
                <Typography variant="body2" color="text.secondary">
                  <strong>Chapter:</strong> {question.chapter.name}
                </Typography>
              )}
              <Typography variant="body2" color="text.secondary">
                <strong>Teacher:</strong> {question.teacher.fullName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Created by:</strong> {question.createdBy.fullName}
              </Typography>
            </Stack>
          </Stack>

          {question.type === 'MultipleChoice' && question.mcqOptions && (
            <Stack spacing={2}>
              <Typography variant="subtitle2" fontWeight={600}>
                Options
              </Typography>
              <Stack spacing={1}>
                <Typography variant="body2">
                  A) {question.mcqOptions.optionA}
                  {question.mcqOptions.correctOption === 'A' && (
                    <Chip label="Correct" size="small" color="success" sx={{ ml: 1 }} />
                  )}
                </Typography>
                <Typography variant="body2">
                  B) {question.mcqOptions.optionB}
                  {question.mcqOptions.correctOption === 'B' && (
                    <Chip label="Correct" size="small" color="success" sx={{ ml: 1 }} />
                  )}
                </Typography>
                <Typography variant="body2">
                  C) {question.mcqOptions.optionC}
                  {question.mcqOptions.correctOption === 'C' && (
                    <Chip label="Correct" size="small" color="success" sx={{ ml: 1 }} />
                  )}
                </Typography>
                <Typography variant="body2">
                  D) {question.mcqOptions.optionD}
                  {question.mcqOptions.correctOption === 'D' && (
                    <Chip label="Correct" size="small" color="success" sx={{ ml: 1 }} />
                  )}
                </Typography>
              </Stack>
            </Stack>
          )}

          {question.type === 'TrueFalse' && question.trueFalseAnswer !== null && (
            <Stack spacing={2}>
              <Typography variant="subtitle2" fontWeight={600}>
                Answer
              </Typography>
              <Chip
                label={question.trueFalseAnswer ? 'True' : 'False'}
                color={question.trueFalseAnswer ? 'success' : 'error'}
                size="small"
              />
            </Stack>
          )}

          {question.modelAnswer && (
            <Stack spacing={2}>
              <Typography variant="subtitle2" fontWeight={600}>
                Model Answer
              </Typography>
              <Typography variant="body2" sx={{ bgcolor: 'grey.50', p: 2, borderRadius: 1 }}>
                {question.modelAnswer}
              </Typography>
            </Stack>
          )}

          {question.type === 'FillInTheBlank' && question.blankAnswers.length > 0 && (
            <Stack spacing={2}>
              <Typography variant="subtitle2" fontWeight={600}>
                Blank Answers
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {question.blankAnswers.map((answer, index) => (
                  <Chip key={index} label={answer} size="small" variant="outlined" />
                ))}
              </Stack>
            </Stack>
          )}

          <Stack spacing={1}>
            <Typography variant="caption" color="text.secondary">
              Created: {new Date(question.createdAt).toLocaleString()}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Updated: {new Date(question.updatedAt).toLocaleString()}
            </Typography>
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
