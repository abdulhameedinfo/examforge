import type { HttpClient } from './httpClient';
import type { SyncChangeDto } from '../types';

export type SyncUploadResponse = {
  results: Array<{
    id: string;
    entity: string;
    status: 'ok' | 'conflict' | 'error';
    newVersion?: number | null;
    updatedAt?: string | null;
    serverRecord?: unknown | null;
    message?: string | null;
  }>;
  serverSyncToken: number;
};

export type SyncDownloadResponse = {
  changes: SyncChangeDto[];
  serverSyncToken: number;
};

export function createSyncApi(http: HttpClient) {
  return {
    upload(deviceId: string, changes: SyncChangeDto[]) {
      return http.post<SyncUploadResponse>('/api/sync/upload', { deviceId, changes });
    },
    download(sinceToken: number) {
      return http.get<SyncDownloadResponse>(`/api/sync/download?sinceToken=${sinceToken}`);
    },
  };
}

