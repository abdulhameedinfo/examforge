# Synchronization Design

## Synchronization Model

Push + Pull

### Upload

POST /api/sync/upload

Uploads:

* Created records
* Updated records
* Deleted records

### Download

GET /api/sync/download

Downloads:

* New records
* Updated records
* Deleted records

## Sync Queue

Stores pending operations.

Columns:

* Id
* EntityType
* EntityId
* Operation
* Payload
* Status
* RetryCount
* CreatedAt

## Sync Metadata

Stores synchronization state.

Columns:

* LastSyncToken
* LastSyncDate

## Conflict Detection

Uses optimistic concurrency.

Each syncable entity contains:

* Version

Rules:

ClientVersion == ServerVersion

Result:

* Success
* Version Increment

Otherwise:

* Conflict

## Conflict Handling

Questions:

* Reload and reapply changes

Subjects:

* Reload or overwrite

Deletes:

* User confirmation required
