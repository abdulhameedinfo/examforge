PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS subjects (
  local_id TEXT PRIMARY KEY,
  server_id TEXT UNIQUE,
  name TEXT NOT NULL,
  code TEXT NOT NULL,
  description TEXT,
  version INTEGER NOT NULL DEFAULT 0,
  updated_at TEXT NOT NULL,
  is_synced INTEGER NOT NULL DEFAULT 0,
  is_deleted INTEGER NOT NULL DEFAULT 0,
  deleted_at TEXT,
  created_at TEXT NOT NULL,
  sync_error TEXT
);

CREATE INDEX IF NOT EXISTS idx_subjects_server_id ON subjects(server_id);
CREATE INDEX IF NOT EXISTS idx_subjects_sync_state ON subjects(is_synced, is_deleted, updated_at);

CREATE TABLE IF NOT EXISTS questions (
  local_id TEXT PRIMARY KEY,
  server_id TEXT UNIQUE,
  subject_local_id TEXT NOT NULL,
  subject_server_id TEXT,
  title TEXT NOT NULL,
  body TEXT,
  answer TEXT,
  question_type TEXT NOT NULL,
  version INTEGER NOT NULL DEFAULT 0,
  updated_at TEXT NOT NULL,
  is_synced INTEGER NOT NULL DEFAULT 0,
  is_deleted INTEGER NOT NULL DEFAULT 0,
  deleted_at TEXT,
  created_at TEXT NOT NULL,
  sync_error TEXT,
  FOREIGN KEY (subject_local_id) REFERENCES subjects(local_id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_questions_subject_local_id ON questions(subject_local_id);
CREATE INDEX IF NOT EXISTS idx_questions_server_id ON questions(server_id);
CREATE INDEX IF NOT EXISTS idx_questions_sync_state ON questions(is_synced, is_deleted, updated_at);

CREATE TABLE IF NOT EXISTS sync_queue (
  queue_id TEXT PRIMARY KEY,
  entity_type TEXT NOT NULL,
  entity_local_id TEXT NOT NULL,
  operation TEXT NOT NULL,
  base_version INTEGER NOT NULL,
  payload_json TEXT,
  created_at TEXT NOT NULL,
  retry_count INTEGER NOT NULL DEFAULT 0,
  last_error TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  UNIQUE(entity_type, entity_local_id)
);

CREATE INDEX IF NOT EXISTS idx_sync_queue_status_created_at ON sync_queue(status, created_at);
CREATE INDEX IF NOT EXISTS idx_sync_queue_entity ON sync_queue(entity_type, entity_local_id);

CREATE TABLE IF NOT EXISTS sync_meta (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  last_sync_token INTEGER NOT NULL DEFAULT 0
);

INSERT OR IGNORE INTO sync_meta (id, last_sync_token) VALUES (1, 0);
