import { getDb } from '../db';
import type { SubjectRow } from '../types';
import { createUuid } from '../utils/uuid';

function nowUtc(): string {
  return new Date().toISOString();
}

export class SubjectRepository {
  async getByLocalId(localId: string): Promise<SubjectRow | null> {
    const db = await getDb();
    const row = await db.getFirstAsync<SubjectRow>(
      `
      SELECT
        local_id AS localId,
        server_id AS serverId,
        name,
        code,
        description,
        version,
        updated_at AS updatedAt,
        is_synced AS isSynced,
        is_deleted AS isDeleted,
        deleted_at AS deletedAt,
        created_at AS createdAt,
        sync_error AS syncError
      FROM subjects
      WHERE local_id = ?
      `,
      [localId],
    );

    return row ?? null;
  }

  async upsertLocal(input: {
    localId?: string;
    serverId?: string | null;
    name: string;
    code: string;
    description?: string | null;
    version?: number;
    isSynced?: number;
  }): Promise<string> {
    const db = await getDb();
    const localId = input.localId ?? createUuid();
    const timestamp = nowUtc();
    const version = input.version ?? 0;

    await db.runAsync(
      `
      INSERT INTO subjects (
        local_id, server_id, name, code, description, version,
        updated_at, is_synced, is_deleted, deleted_at, created_at, sync_error
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, NULL, ?, NULL)
      ON CONFLICT(local_id) DO UPDATE SET
        server_id = excluded.server_id,
        name = excluded.name,
        code = excluded.code,
        description = excluded.description,
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
        input.name,
        input.code,
        input.description ?? null,
        version,
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
      UPDATE subjects
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
      UPDATE subjects
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
      UPDATE subjects
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
      UPDATE subjects
      SET is_synced = 0,
          sync_error = ?
      WHERE local_id = ?
      `,
      [error, localId],
    );
  }

  async listPending(): Promise<SubjectRow[]> {
    const db = await getDb();
    return db.getAllAsync<SubjectRow>(
      `
      SELECT
        local_id AS localId,
        server_id AS serverId,
        name,
        code,
        description,
        version,
        updated_at AS updatedAt,
        is_synced AS isSynced,
        is_deleted AS isDeleted,
        deleted_at AS deletedAt,
        created_at AS createdAt,
        sync_error AS syncError
      FROM subjects
      WHERE is_synced = 0
      ORDER BY updated_at ASC
      `,
    );
  }
}
