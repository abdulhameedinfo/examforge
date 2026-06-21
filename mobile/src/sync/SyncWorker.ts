import { SubjectRepository } from '../repositories/SubjectRepository';
import { QuestionRepository } from '../repositories/QuestionRepository';
import { SyncQueueRepository } from '../repositories/SyncQueueRepository';
import { SyncMetaRepository } from '../repositories/SyncMetaRepository';
import type { SyncChangeDto } from '../types';

type UploadResult = {
  id: string;
  entity: string;
  status: 'ok' | 'conflict' | 'error';
  newVersion?: number | null;
  updatedAt?: string | null;
  serverRecord?: unknown | null;
  message?: string | null;
};

type SyncUploadResponse = {
  results: UploadResult[];
  serverSyncToken: number;
};

type SyncDownloadResponse = {
  changes: SyncChangeDto[];
  serverSyncToken: number;
};

export class SyncWorker {
  private readonly subjects = new SubjectRepository();
  private readonly questions = new QuestionRepository();
  private readonly queue = new SyncQueueRepository();
  private readonly meta = new SyncMetaRepository();

  constructor(private readonly apiBaseUrl: string, private readonly deviceId: string) {}

  async sync(): Promise<void> {
    const pending = await this.queue.listPending();
    if (pending.length > 0) {
      const uploadResponse = await this.uploadPending(pending);
      await this.applyUploadResponse(uploadResponse.results);
      await this.meta.setLastSyncToken(uploadResponse.serverSyncToken);
    }

    await this.downloadRemoteChanges();
  }

  private async uploadPending(pending: Awaited<ReturnType<SyncQueueRepository['listPending']>>): Promise<SyncUploadResponse> {
    const response = await fetch(`${this.apiBaseUrl}/api/sync/upload`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        deviceId: this.deviceId,
        changes: pending.map((item) => ({
          entity: item.entityType,
          operation: item.operation,
          id: item.entityLocalId,
          version: item.baseVersion,
          updatedAt: new Date().toISOString(),
          data: item.payloadJson ? JSON.parse(item.payloadJson) : null,
        })),
      }),
    });

    if (!response.ok) {
      throw new Error(`Sync upload failed with HTTP ${response.status}`);
    }

    return (await response.json()) as SyncUploadResponse;
  }

  private async applyUploadResponse(results: UploadResult[]): Promise<void> {
    for (const result of results) {
      if (result.status === 'ok') {
        await this.handleSuccess(result);
        continue;
      }

      await this.handleFailure(result);
    }
  }

  private async handleSuccess(result: UploadResult): Promise<void> {
    if (result.entity.toLowerCase() === 'subject') {
      await this.subjects.markSynced(result.id, result.id, result.newVersion ?? 0, result.updatedAt ?? new Date().toISOString());
    } else if (result.entity.toLowerCase() === 'question') {
      await this.questions.markSynced(result.id, result.id, result.newVersion ?? 0, result.updatedAt ?? new Date().toISOString());
    }

    const queueRow = await this.findQueueRow(result.id, result.entity);
    if (queueRow) {
      await this.queue.markSent(queueRow.queueId);
    }
  }

  private async handleFailure(result: UploadResult): Promise<void> {
    const error = result.message ?? 'Sync failed';
    if (result.entity.toLowerCase() === 'subject') {
      await this.subjects.markSyncError(result.id, error);
    } else if (result.entity.toLowerCase() === 'question') {
      await this.questions.markSyncError(result.id, error);
    }

    const queueRow = await this.findQueueRow(result.id, result.entity);
    if (queueRow) {
      await this.queue.markError(queueRow.queueId, error, result.status === 'conflict' ? 'conflict' : 'failed');
    }
  }

  private async downloadRemoteChanges(): Promise<void> {
    const sinceToken = await this.meta.getLastSyncToken();
    const response = await fetch(`${this.apiBaseUrl}/api/sync/download?sinceToken=${sinceToken}`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`Sync download failed with HTTP ${response.status}`);
    }

    const data = (await response.json()) as SyncDownloadResponse;
    for (const change of data.changes) {
      await this.applyRemoteChange(change);
    }

    await this.meta.setLastSyncToken(data.serverSyncToken);
  }

  private async applyRemoteChange(change: SyncChangeDto): Promise<void> {
    if (change.operation.toLowerCase() === 'delete') {
      await this.applyRemoteDelete(change);
      return;
    }

    if (change.entity.toLowerCase() === 'subject') {
      const subject = change.data as {
        id: string;
        name: string;
        code: string;
        description: string | null;
        isActive: boolean;
      } | null;

      if (!subject) return;

      await this.subjects.upsertLocal({
        localId: change.id,
        serverId: change.id,
        name: subject.name,
        code: subject.code,
        description: subject.description,
        version: change.version,
        isSynced: 1,
      });
      return;
    }

    if (change.entity.toLowerCase() === 'question') {
      const question = change.data as {
        id: string;
        subjectId: string;
        createdById: string;
        type: string;
        text: string;
        marks: number;
        isActive: boolean;
        modelAnswer: string | null;
      } | null;

      if (!question) return;

      await this.questions.upsertLocal({
        localId: change.id,
        serverId: change.id,
        subjectLocalId: question.subjectId,
        subjectServerId: question.subjectId,
        title: question.text,
        body: null,
        answer: question.modelAnswer,
        questionType: question.type,
        version: change.version,
        isSynced: 1,
      });
    }
  }

  private async applyRemoteDelete(change: SyncChangeDto): Promise<void> {
    if (change.entity.toLowerCase() === 'subject') {
      await this.subjects.markDeletedSynced(change.id, change.id, change.version, change.updatedAt);
      return;
    }

    if (change.entity.toLowerCase() === 'question') {
      await this.questions.markDeletedSynced(change.id, change.id, change.version, change.updatedAt);
    }
  }

  private async findQueueRow(entityLocalId: string, entityType: string) {
    const pending = await this.queue.listPending();
    return pending.find((row) => row.entityLocalId === entityLocalId && row.entityType.toLowerCase() === entityType.toLowerCase()) ?? null;
  }
}
