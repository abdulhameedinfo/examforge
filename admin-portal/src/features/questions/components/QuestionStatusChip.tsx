import { Chip } from '@mui/material';
import { getQuestionStatusLabel } from '../utils/questionLabels';

type QuestionStatusChipProps = {
  isActive: boolean;
};

export function QuestionStatusChip({ isActive }: QuestionStatusChipProps) {
  return (
    <Chip
      label={getQuestionStatusLabel(isActive)}
      size="small"
      color={isActive ? 'success' : 'default'}
      variant="outlined"
    />
  );
}

