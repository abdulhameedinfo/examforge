export type QuestionType = 'MultipleChoice' | 'ShortQuestion' | 'LongQuestion' | 'FillInTheBlank' | 'TrueFalse';

export type TeacherQuestionCount = {
  teacherId: string;
  teacherName: string;
  questionCount: number;
};

export type SubjectQuestionCount = {
  subjectId: string;
  subjectName: string;
  questionCount: number;
};

export type QuestionTypeDistribution = {
  type: QuestionType;
  label: string;
  count: number;
};

export type DifficultyDistribution = {
  difficultyId: string;
  difficultyName: string;
  count: number;
};

export type RecentQuestion = {
  id: string;
  text: string;
  type: QuestionType;
  subject: string;
  teacher: string;
  difficulty: string;
  createdAt: string;
};

export type SyncStatus = {
  lastSyncTime: string;
  status: 'synced' | 'syncing' | 'error';
  pendingChanges: number;
};

export type ReportsDashboardData = {
  questionsPerTeacher: TeacherQuestionCount[];
  questionsPerSubject: SubjectQuestionCount[];
  questionTypeDistribution: QuestionTypeDistribution[];
  difficultyDistribution: DifficultyDistribution[];
  recentQuestions: RecentQuestion[];
  syncStatus: SyncStatus;
};
