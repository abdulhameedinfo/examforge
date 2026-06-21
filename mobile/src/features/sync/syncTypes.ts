import type { SyncChangeDto } from '../../types';

export interface SyncState {
  isSyncing: boolean;
  lastSyncToken: number;
  pendingCount: number;
  lastError: string | null;
  conflictCount: number;
}

export interface SyncSummary {
  uploaded: number;
  conflicts: number;
  downloaded: number;
  nextToken: number;
}

export type { SyncChangeDto };

