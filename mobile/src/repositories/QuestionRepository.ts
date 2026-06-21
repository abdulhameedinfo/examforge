import { getDb } from '../db';
import type { QuestionRow } from '../types';
import { createUuid } from '../utils/uuid';

function nowUtc(): string {
  return new Date().toISOString();
}

export class QuestionRepository {
  async getByLocalId(localId: string): Promise<QuestionRow | null> {
    const db = await getDb();
    const row = await db.getFirstAsync<QuestionRow>(
      `
      SELECT
        local_id AS localId,
        server_id AS serverId,
        subject_local_id AS subjectLocalId,
        subject_server_id AS subjectServerId,
        title,
        body,
        answer,
        question_type AS questionType,
        version,
        updated_at AS updatedAt,
        is_synced AS isSynced,
        is_deleted AS isDeleted,
        deleted_at AS deletedAt,
        created_at AS createdAt,
        sync_error AS syncError
      FROM questions
      WHERE local_id = ?
      `,
      [localId],
    );

    return row ?? null;
  }

  async upsertLocal(input: {
    localId?: string;
    serverId?: string | null;
    subjectLocalId: string;
    subjectServerId?: string | null;
    title: string;
    body?: string | null;
    answer?: string | null;
    questionType: string;
    version?: number;
    isSynced?: number;
  }): Promise<string> {
    const db = await getDb();
    const localId = input.localId ?? createUuid();
    const timestamp = nowUtc();

    await db.runAsync(
      `
      INSERT INTO questions (
        local_id, server_id, subject_local_id, subject_server_id, title,
        body, answer, question_type, version, updated_at, is_synced,
        is_deleted, deleted_at, created_at, sync_error
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, NULL, ?, NULL)
      ON CONFLICT(local_id) DO UPDATE SET
        server_id = excluded.server_id,
        subject_local_id = excluded.subject_local_id,
        subject_server_id = excluded.subject_server_id,
        title = excluded.title,
        body = excluded.body,
        answer = excluded.answer,
        question_type = excluded.question_type,
        version = excluded.version,
        updated_at = excluded.updated_at,
        is_synced = excluded.is_synced,
        is_deleted = 0,
        deleted_at = NULL,
        sync_error = NULL
      `,
      [
        localId,
        input.serverId ?? null,
        input.subjectLocalId,
        input.subjectServerId ?? null,
        input.title,
        input.body ?? null,
        input.answer ?? null,
        input.questionType,
        input.version ?? 0,
        timestamp,
        input.isSynced ?? 0,
        timestamp,
      ],
    );

    return localId;
  }

  async softDelete(localId: string): Promise<void> {
    const db = await getDb();
    const timestamp = nowUtc();
    await db.runAsync(
      `
      UPDATE questions
      SET is_deleted = 1,
          deleted_at = ?,
          is_synced = 0,
          sync_error = NULL,
          updated_at = ?
      WHERE local_id = ?
      `,
      [timestamp, timestamp, localId],
    );
  }

  async markSynced(localId: string, serverId: string | null, version: number, updatedAt: string): Promise<void> {
    const db = await getDb();
    await db.runAsync(
      `
      UPDATE questions
      SET server_id = COALESCE(?, server_id),
          version = ?,
          updated_at = ?,
          is_synced = 1,
          sync_error = NULL
      WHERE local_id = ?
      `,
      [serverId, version, updatedAt, localId],
    );
  }

  async markDeletedSynced(localId: string, serverId: string | null, version: number, updatedAt: string): Promise<void> {
    const db = await getDb();
    await db.runAsync(
      `
      UPDATE questions
      SET server_id = COALESCE(?, server_id),
          version = ?,
          updated_at = ?,
          is_synced = 1,
          is_deleted = 1,
          deleted_at = ?,
          sync_error = NULL
      WHERE local_id = ?
      `,
      [serverId, version, updatedAt, updatedAt, localId],
    );
  }

  async markSyncError(localId: string, error: string): Promise<void> {
    const db = await getDb();
    await db.runAsync(
      `
      UPDATE questions
      SET is_synced = 0,
          sync_error = ?
      WHERE local_id = ?
      `,
      [error, localId],
    );
  }

  async listPending(): Promise<QuestionRow[]> {
    const db = await getDb();
    return db.getAllAsync<QuestionRow>(
      `
      SELECT
        local_id AS localId,
        server_id AS serverId,
        subject_local_id AS subjectLocalId,
        subject_server_id AS subjectServerId,
        title,
        body,
        answer,
        question_type AS questionType,
        version,
        updated_at AS updatedAt,
        is_synced AS isSynced,
        is_deleted AS isDeleted,
        deleted_at AS deletedAt,
        created_at AS createdAt,
        sync_error AS syncError
      FROM questions
      WHERE is_synced = 0
      ORDER BY updated_at ASC
      `,
    );
  }
}
