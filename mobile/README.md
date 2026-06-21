# React Native Offline Sync

This folder contains drop-in SQLite schema and TypeScript examples for the offline-first mobile app.

## Files

- `sqlite/schema.sql` - local tables for `subjects`, `questions`, `sync_queue`, and `sync_meta`
- `src/db.ts` - SQLite initialization
- `src/repositories/*` - local persistence helpers
- `src/services/OfflineMutationService.ts` - write path that saves locally and enqueues sync
- `src/sync/SyncWorker.ts` - pushes queued changes and pulls server changes

## Sync flow

1. Save locally to SQLite.
2. Add or replace a row in `sync_queue`.
3. POST queued changes to `POST /api/sync/upload`.
4. Apply per-record server acknowledgments.
5. Pull changes from `GET /api/sync/download?sinceToken=...`.
6. Merge remote changes back into SQLite.

## Notes

- `local_id` is the device-generated UUID.
- `server_id` is nullable until the first successful sync.
- Deletes are soft deletes locally and on the server.
- `sync_meta.last_sync_token` stores the incremental pull cursor.

