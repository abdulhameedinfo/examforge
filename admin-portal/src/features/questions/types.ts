export type QuestionType = 'MultipleChoice' | 'ShortQuestion' | 'LongQuestion' | 'FillInTheBlank' | 'TrueFalse';

export const questionTypeOptions: Array<{ value: QuestionType; label: string }> = [
  { value: 'MultipleChoice', label: 'MCQ' },
  { value: 'ShortQuestion', label: 'Short Question' },
  { value: 'LongQuestion', label: 'Long Question' },
  { value: 'FillInTheBlank', label: 'Fill in the Blank' },
  { value: 'TrueFalse', label: 'True False' },
];

export type QuestionStatusValue = 'all' | 'active' | 'inactive';

export type NamedEntity = {
  id: string;
  name: string;
};

export type TeacherSummary = {
  id: string;
  fullName: string;
};

export type McqOptions = {
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctOption: 'A' | 'B' | 'C' | 'D';
};

export type QuestionListItem = {
  id: string;
  text: string;
  type: QuestionType;
  subject: NamedEntity;
  chapter?: NamedEntity | null;
  teacher: TeacherSummary;
  difficulty?: NamedEntity | null;
  marks: number;
  isActive: boolean;
  updatedAt: string;
};

export type QuestionDetail = QuestionListItem & {
  createdAt: string;
  createdBy: TeacherSummary;
  modelAnswer?: string | null;
  trueFalseAnswer?: boolean | null;
  mcqOptions?: McqOptions | null;
  blankAnswers: string[];
};

export type QuestionUpsertPayload = {
  subjectId: string;
  chapterId: string;
  teacherId: string;
  difficultyId: string;
  type: QuestionType;
  text: string;
  marks: number;
  isActive: boolean;
  modelAnswer?: string | null;
  trueFalseAnswer?: boolean | null;
  mcqOptions?: McqOptions | null;
  blankAnswers?: string[];
};

export type QuestionListQuery = {
  pageNumber: number;
  pageSize: number;
  search?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  subjectId?: string;
  chapterId?: string;
  teacherId?: string;
  difficultyId?: string;
  type?: QuestionType | 'all';
  status?: QuestionStatusValue;
};

export type QuestionFormValues = {
  subjectId: string;
  chapterId: string;
  teacherId: string;
  difficultyId: string;
  type: QuestionType;
  text: string;
  marks: number;
  isActive: boolean;
  mcqOptionA: string;
  mcqOptionB: string;
  mcqOptionC: string;
  mcqOptionD: string;
  mcqCorrectOption: 'A' | 'B' | 'C' | 'D';
  trueFalseAnswer: boolean | null;
  modelAnswer: string;
  blankAnswers: string[];
};

export type QuestionStatistics = {
  totalQuestions: number;
  activeQuestions: number;
  inactiveQuestions: number;
  totalByType: Record<string, number>;
  totalByDifficulty: Record<string, number>;
  totalBySubject: Record<string, number>;
  averageMarks: number;
};

