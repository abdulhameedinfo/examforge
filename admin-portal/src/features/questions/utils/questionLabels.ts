import type { QuestionType } from '../types';

export function getQuestionTypeLabel(type: QuestionType) {
  switch (type) {
    case 'MultipleChoice':
      return 'MCQ';
    case 'ShortQuestion':
      return 'Short Question';
    case 'LongQuestion':
      return 'Long Question';
    case 'FillInTheBlank':
      return 'Fill in the Blank';
    case 'TrueFalse':
      return 'True False';
    default:
      return type;
  }
}

export function getQuestionStatusLabel(isActive: boolean) {
  return isActive ? 'Active' : 'Inactive';
}

