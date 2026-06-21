export interface Question {
  localId: string;
  serverId: string | null;
  subjectLocalId: string;
  subjectServerId: string | null;
  title: string;
  body: string | null;
  answer: string | null;
  questionType: string;
  version: number;
  updatedAt: string;
  isSynced: number;
  isDeleted: number;
}

