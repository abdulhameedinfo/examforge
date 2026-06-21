import { createStore } from '../../common/store';
import type { SyncState } from './syncTypes';

export const syncStore = createStore<SyncState>({
  isSyncing: false,
  lastSyncToken: 0,
  pendingCount: 0,
  lastError: null,
  conflictCount: 0,
});

