import { z } from 'zod';
import type { QuestionFormValues, QuestionType, QuestionUpsertPayload } from '../types';

const uuidSchema = z.string().min(1, 'This field is required');

export const questionFormSchema = z
  .object({
    subjectId: uuidSchema,
    chapterId: uuidSchema,
    teacherId: uuidSchema,
    difficultyId: uuidSchema,
    type: z.enum(['MultipleChoice', 'ShortQuestion', 'LongQuestion', 'FillInTheBlank', 'TrueFalse']),
    text: z.string().trim().min(1, 'Question text is required'),
    marks: z.coerce.number().positive('Marks must be greater than 0'),
    isActive: z.boolean(),
    mcqOptionA: z.string().trim(),
    mcqOptionB: z.string().trim(),
    mcqOptionC: z.string().trim(),
    mcqOptionD: z.string().trim(),
    mcqCorrectOption: z.enum(['A', 'B', 'C', 'D']),
    trueFalseAnswer: z.boolean().nullable(),
    modelAnswer: z.string().trim(),
    blankAnswers: z.array(z.string().trim()),
  })
  .superRefine((values, ctx) => {
    if (values.type === 'MultipleChoice') {
      const options = [values.mcqOptionA, values.mcqOptionB, values.mcqOptionC, values.mcqOptionD];
      options.forEach((option, index) => {
        if (!option) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: [`mcqOption${String.fromCharCode(65 + index)}`],
            message: 'Option text is required',
          });
        }
      });
    }

    if (values.type === 'TrueFalse' && values.trueFalseAnswer === null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['trueFalseAnswer'],
        message: 'Select the correct answer',
      });
    }

    if (values.type === 'FillInTheBlank') {
      const answers = values.blankAnswers.map((answer) => answer.trim()).filter(Boolean);
      if (answers.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['blankAnswers'],
          message: 'Add at least one acceptable answer',
        });
      }
    }
  });

export function getQuestionFormDefaultValues(): QuestionFormValues {
  return {
    subjectId: '',
    chapterId: '',
    teacherId: '',
    difficultyId: '',
    type: 'MultipleChoice',
    text: '',
    marks: 1,
    isActive: true,
    mcqOptionA: '',
    mcqOptionB: '',
    mcqOptionC: '',
    mcqOptionD: '',
    mcqCorrectOption: 'A',
    trueFalseAnswer: null,
    modelAnswer: '',
    blankAnswers: [''],
  };
}

export function mapQuestionFormValuesToPayload(values: QuestionFormValues): QuestionUpsertPayload {
  const blankAnswers = values.blankAnswers.map((answer) => answer.trim()).filter(Boolean);

  return {
    subjectId: values.subjectId,
    chapterId: values.chapterId,
    teacherId: values.teacherId,
    difficultyId: values.difficultyId,
    type: values.type,
    text: values.text.trim(),
    marks: values.marks,
    isActive: values.isActive,
    mcqOptions:
      values.type === 'MultipleChoice'
        ? {
            optionA: values.mcqOptionA.trim(),
            optionB: values.mcqOptionB.trim(),
            optionC: values.mcqOptionC.trim(),
            optionD: values.mcqOptionD.trim(),
            correctOption: values.mcqCorrectOption,
          }
        : null,
    trueFalseAnswer: values.type === 'TrueFalse' ? values.trueFalseAnswer ?? false : null,
    modelAnswer:
      values.type === 'ShortQuestion' || values.type === 'LongQuestion'
        ? values.modelAnswer.trim() || null
        : null,
    blankAnswers: values.type === 'FillInTheBlank' ? blankAnswers : [],
  };
}

export function mapQuestionDetailToFormValues(question?: {
  subject?: { id: string };
  chapter?: { id: string } | null;
  teacher?: { id: string };
  difficulty?: { id: string } | null;
  type: QuestionType;
  text: string;
  marks: number;
  isActive: boolean;
  modelAnswer?: string | null;
  trueFalseAnswer?: boolean | null;
  mcqOptions?: {
    optionA: string;
    optionB: string;
    optionC: string;
    optionD: string;
    correctOption: 'A' | 'B' | 'C' | 'D';
  } | null;
  blankAnswers?: string[];
}) {
  const defaults = getQuestionFormDefaultValues();

  if (!question) {
    return defaults;
  }

  return {
    ...defaults,
    subjectId: question.subject?.id ?? '',
    chapterId: question.chapter?.id ?? '',
    teacherId: question.teacher?.id ?? '',
    difficultyId: question.difficulty?.id ?? '',
    type: question.type,
    text: question.text,
    marks: question.marks,
    isActive: question.isActive,
    modelAnswer: question.modelAnswer ?? '',
    trueFalseAnswer: question.trueFalseAnswer ?? null,
    mcqOptionA: question.mcqOptions?.optionA ?? '',
    mcqOptionB: question.mcqOptions?.optionB ?? '',
    mcqOptionC: question.mcqOptions?.optionC ?? '',
    mcqOptionD: question.mcqOptions?.optionD ?? '',
    mcqCorrectOption: question.mcqOptions?.correctOption ?? 'A',
    blankAnswers: question.blankAnswers?.length ? question.blankAnswers : [''],
  };
}
