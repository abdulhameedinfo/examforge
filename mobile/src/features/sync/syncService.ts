import { createHttpClient } from '../../api/httpClient';
import { createSyncApi } from '../../api/syncApi';
import { SyncWorker } from '../../sync/SyncWorker';

export class AppSyncService {
  private readonly worker: SyncWorker;

  constructor(apiBaseUrl: string, deviceId: string) {
    const http = createHttpClient(apiBaseUrl);
    const syncApi = createSyncApi(http);
    this.worker = new SyncWorker(syncApi, deviceId);
  }

  syncNow() {
    return this.worker.sync();
  }
}
