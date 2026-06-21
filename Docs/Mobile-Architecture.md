# Mobile Architecture

## Architecture Style

Offline-First

## Layers

### Presentation

* Screens
* Components
* Navigation

### State Layer

* Zustand

Responsibilities:

* UI State
* Screen State

### Service Layer

Responsibilities:

* Business Workflows
* Synchronization Coordination

### Repository Layer

Responsibilities:

* SQL Access
* Local Persistence

### Database Layer

SQLite

Tables:

* subjects
* questions
* sync_queue
* sync_meta

## Offline Behaviour

### Create

Save locally and queue sync event.

### Update

Update locally and queue sync event.

### Delete

Soft delete locally and queue sync event.

## Online Behaviour

Sync worker uploads pending changes and downloads remote updates.
