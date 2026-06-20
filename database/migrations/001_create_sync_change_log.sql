CREATE TABLE IF NOT EXISTS sync_change_log (
    id BIGSERIAL PRIMARY KEY,
    entity VARCHAR(64) NOT NULL,
    entity_id UUID NOT NULL,
    operation VARCHAR(16) NOT NULL,
    version BIGINT NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL,
    payload_json TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS ix_sync_change_log_created_at
    ON sync_change_log (created_at);

CREATE INDEX IF NOT EXISTS ix_sync_change_log_entity_entity_id_version
    ON sync_change_log (entity, entity_id, version);

