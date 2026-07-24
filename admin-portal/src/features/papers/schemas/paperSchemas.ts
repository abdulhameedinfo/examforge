import { z } from 'zod';
import type { QuestionType } from '../../questions/types';
import type { ExamPaperGeneratorFormValues, ExamPaperGeneratorPayload } from '../types';

const questionTypeSchema = z.object({
  questionType: z.enum(['MultipleChoice', 'ShortQuestion', 'LongQuestion', 'FillInTheBlank', 'TrueFalse']),
  percentage: z.number().min(0).max(100),
});

const teacherDistributionSchema = z.object({
  teacherId: z.string().min(1, 'Teacher is required'),
  teacherName: z.string(),
  percentage: z.number().min(0).max(100),
});

const difficultyDistributionSchema = z.object({
  difficultyId: z.string().min(1, 'Difficulty is required'),
  difficultyName: z.string(),
  percentage: z.number().min(0).max(100),
});

export const examPaperGeneratorSchema = z.object({
  subjectId: z.string().min(1, 'Subject is required'),
  classId: z.string().min(1, 'Class is required'),
  totalQuestions: z.number().min(1, 'At least 1 question is required').max(200, 'Maximum 200 questions allowed'),
  questionTypeDistribution: z.array(questionTypeSchema).min(1, 'At least one question type is required'),
  teacherDistribution: z.array(teacherDistributionSchema).min(1, 'At least one teacher is required'),
  difficultyDistribution: z.array(difficultyDistributionSchema).min(1, 'At least one difficulty level is required'),
}).refine(
  (data) => {
    const totalPercentage = data.questionTypeDistribution.reduce((sum, item) => sum + item.percentage, 0);
    return Math.abs(totalPercentage - 100) < 0.01;
  },
  {
    message: 'Question type distribution must total 100%',
    path: ['questionTypeDistribution'],
  }
).refine(
  (data) => {
    const totalPercentage = data.teacherDistribution.reduce((sum, item) => sum + item.percentage, 0);
    return Math.abs(totalPercentage - 100) < 0.01;
  },
  {
    message: 'Teacher distribution must total 100%',
    path: ['teacherDistribution'],
  }
).refine(
  (data) => {
    const totalPercentage = data.difficultyDistribution.reduce((sum, item) => sum + item.percentage, 0);
    return Math.abs(totalPercentage - 100) < 0.01;
  },
  {
    message: 'Difficulty distribution must total 100%',
    path: ['difficultyDistribution'],
  }
);

export type ExamPaperGeneratorInput = z.input<typeof examPaperGeneratorSchema>;
export type ExamPaperGeneratorOutput = z.output<typeof examPaperGeneratorSchema>;

export function getExamPaperGeneratorDefaultValues(): ExamPaperGeneratorFormValues {
  return {
    subjectId: '',
    classId: '',
    totalQuestions: 10,
    questionTypeDistribution: [],
    teacherDistribution: [],
    difficultyDistribution: [],
  };
}

export function mapFormValuesToPayload(values: ExamPaperGeneratorFormValues): ExamPaperGeneratorPayload {
  return {
    subjectId: values.subjectId,
    classId: values.classId,
    totalQuestions: values.totalQuestions,
    questionTypeDistribution: values.questionTypeDistribution.map((item) => ({
      questionType: item.questionType,
      percentage: item.percentage,
    })),
    teacherDistribution: values.teacherDistribution.map((item) => ({
      teacherId: item.teacherId,
      percentage: item.percentage,
    })),
    difficultyDistribution: values.difficultyDistribution.map((item) => ({
      difficultyId: item.difficultyId,
      percentage: item.percentage,
    })),
  };
}

export function validateDistribution(distribution: Array<{ percentage: number }>): string | null {
  const total = distribution.reduce((sum, item) => sum + item.percentage, 0);
  if (Math.abs(total - 100) > 0.01) {
    return `Distribution must total 100%, currently at ${total.toFixed(1)}%`;
  }
  return null;
}
