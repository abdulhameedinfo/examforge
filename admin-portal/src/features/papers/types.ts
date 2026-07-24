import type { IdNameDto } from '../../shared/api/types';
import type { QuestionType } from '../questions/types';

export type QuestionTypeDistribution = {
  questionType: QuestionType;
  percentage: number;
};

export type TeacherDistribution = {
  teacherId: string;
  teacherName: string;
  percentage: number;
};

export type DifficultyDistribution = {
  difficultyId: string;
  difficultyName: string;
  percentage: number;
};

export type ExamPaperGeneratorFormValues = {
  subjectId: string;
  classId: string;
  totalQuestions: number;
  questionTypeDistribution: QuestionTypeDistribution[];
  teacherDistribution: TeacherDistribution[];
  difficultyDistribution: DifficultyDistribution[];
};

export type ExamPaperGeneratorPayload = {
  subjectId: string;
  classId: string;
  totalQuestions: number;
  questionTypeDistribution: Array<{
    questionType: QuestionType;
    percentage: number;
  }>;
  teacherDistribution: Array<{
    teacherId: string;
    percentage: number;
  }>;
  difficultyDistribution: Array<{
    difficultyId: string;
    percentage: number;
  }>;
};

export type GeneratedQuestion = {
  id: string;
  text: string;
  type: QuestionType;
  marks: number;
  teacher: IdNameDto;
  difficulty: IdNameDto;
  chapter?: IdNameDto | null;
};

export type GeneratedExamPaper = {
  id: string;
  subject: IdNameDto;
  class: IdNameDto;
  totalQuestions: number;
  totalMarks: number;
  generatedAt: string;
  questions: GeneratedQuestion[];
};

export type ExamPaperValidationError = {
  field: string;
  message: string;
};
