export type EntityType = 'subject' | 'question';
export type SyncOperation = 'upsert' | 'delete';
export type SyncQueueStatus = 'pending' | 'processing' | 'failed' | 'conflict' | 'sent';

export interface SubjectRow {
  localId: string;
  serverId: string | null;
  name: string;
  code: string;
  description: string | null;
  version: number;
  updatedAt: string;
  isSynced: number;
  isDeleted: number;
  deletedAt: string | null;
  createdAt: string;
  syncError: string | null;
}

export interface QuestionRow {
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
  deletedAt: string | null;
  createdAt: string;
  syncError: string | null;
}

export interface SyncQueueRow {
  queueId: string;
  entityType: EntityType;
  entityLocalId: string;
  operation: SyncOperation;
  baseVersion: number;
  payloadJson: string | null;
  createdAt: string;
  retryCount: number;
  lastError: string | null;
  status: SyncQueueStatus;
}

export interface SyncChangeDto {
  entity: EntityType;
  operation: SyncOperation;
  id: string;
  version: number;
  updatedAt: string;
  data: unknown | null;
}

