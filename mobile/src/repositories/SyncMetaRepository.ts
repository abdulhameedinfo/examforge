import { getDb } from '../db';

export class SyncMetaRepository {
  async getLastSyncToken(): Promise<number> {
    const db = await getDb();
    const row = await db.getFirstAsync<{ lastSyncToken: number }>(
      `SELECT last_sync_token AS lastSyncToken FROM sync_meta WHERE id = 1`,
    );

    return row?.lastSyncToken ?? 0;
  }

  async setLastSyncToken(token: number): Promise<void> {
    const db = await getDb();
    await db.runAsync(`UPDATE sync_meta SET last_sync_token = ? WHERE id = 1`, [token]);
  }
}

