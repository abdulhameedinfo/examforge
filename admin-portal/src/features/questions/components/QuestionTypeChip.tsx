import { Chip } from '@mui/material';
import { getQuestionTypeLabel } from '../utils/questionLabels';
import type { QuestionType } from '../types';

type QuestionTypeChipProps = {
  type: QuestionType;
};

export function QuestionTypeChip({ type }: QuestionTypeChipProps) {
  return <Chip label={getQuestionTypeLabel(type)} size="small" variant="outlined" />;
}

