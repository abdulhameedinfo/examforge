import { getDb } from '../db';
import type { EntityType, SyncOperation, SyncQueueRow } from '../types';
import { createUuid } from '../utils/uuid';

function nowUtc(): string {
  return new Date().toISOString();
}

export class SyncQueueRepository {
  async enqueue(input: {
    entityType: EntityType;
    entityLocalId: string;
    operation: SyncOperation;
    baseVersion: number;
    payload: unknown | null;
  }): Promise<string> {
    const db = await getDb();
    const queueId = createUuid();
    const timestamp = nowUtc();
    const payloadJson = input.payload == null ? null : JSON.stringify(input.payload);

    await db.runAsync(
      `
      INSERT INTO sync_queue (
        queue_id, entity_type, entity_local_id, operation, base_version,
        payload_json, created_at, retry_count, last_error, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, 0, NULL, 'pending')
      ON CONFLICT(entity_type, entity_local_id) DO UPDATE SET
        queue_id = excluded.queue_id,
        operation = excluded.operation,
        base_version = excluded.base_version,
        payload_json = excluded.payload_json,
        created_at = excluded.created_at,
        retry_count = 0,
        last_error = NULL,
        status = 'pending'
      `,
      [
        queueId,
        input.entityType,
        input.entityLocalId,
        input.operation,
        input.baseVersion,
        payloadJson,
        timestamp,
      ],
    );

    return queueId;
  }

  async listPending(): Promise<SyncQueueRow[]> {
    const db = await getDb();
    return db.getAllAsync<SyncQueueRow>(
      `
      SELECT
        queue_id AS queueId,
        entity_type AS entityType,
        entity_local_id AS entityLocalId,
        operation,
        base_version AS baseVersion,
        payload_json AS payloadJson,
        created_at AS createdAt,
        retry_count AS retryCount,
        last_error AS lastError,
        status
      FROM sync_queue
      WHERE status IN ('pending', 'failed', 'conflict')
      ORDER BY created_at ASC
      `,
    );
  }

  async markProcessing(queueId: string): Promise<void> {
    const db = await getDb();
    await db.runAsync(`UPDATE sync_queue SET status = 'processing' WHERE queue_id = ?`, [queueId]);
  }

  async markSent(queueId: string): Promise<void> {
    const db = await getDb();
    await db.runAsync(`DELETE FROM sync_queue WHERE queue_id = ?`, [queueId]);
  }

  async markError(queueId: string, error: string, status: 'failed' | 'conflict'): Promise<void> {
    const db = await getDb();
    await db.runAsync(
      `
      UPDATE sync_queue
      SET retry_count = retry_count + 1,
          last_error = ?,
          status = ?
      WHERE queue_id = ?
      `,
      [error, status, queueId],
    );
  }
}

