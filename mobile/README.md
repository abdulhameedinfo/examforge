# React Native Offline Architecture

This folder contains a React Native architecture scaffold for the offline-first Question Bank app.

## Structure

```text
src/
  app/
    App.tsx
    bootstrap/
  api/
  common/
  db/
    migrations/
  features/
    questions/
    subjects/
    sync/
  repositories/
  services/
  sync/
  types.ts
  utils/
sqlite/
  schema.sql
```

## Flow

- Local writes go to SQLite first.
- Each write also enqueues a sync item.
- `sync_queue` is the outbox.
- `sync_meta.last_sync_token` stores the server cursor.
- `SyncWorker` uploads pending changes, applies acknowledgments, then pulls server changes.

## Core responsibilities

- `repositories/` owns SQLite access.
- `services/` owns offline-first mutations.
- `sync/` owns upload and download orchestration.
- `features/*Store` holds in-memory state for screens.
- `api/` owns HTTP calls to the ASP.NET Core backend.

