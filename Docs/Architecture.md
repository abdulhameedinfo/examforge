# System Architecture

## Overview

ExamForge follows an offline-first architecture.

The solution consists of:

1. React Native Mobile Application
2. ASP.NET Core Backend API
3. PostgreSQL Database
4. QuestPDF Document Service

The backend is the authoritative source of truth.

The mobile application maintains a local SQLite database and synchronizes changes when connectivity becomes available.

## Architectural Goals

* Offline usability
* Fast local operations
* Eventual consistency
* Deterministic paper generation
* Scalable backend services
* Clear separation of concerns

## Core Components

### Mobile Layer

* UI
* State Management
* Services
* Repositories
* SQLite
* Sync Worker

### Backend Layer

* API
* Application
* Domain
* Persistence
* Infrastructure

### Storage Layer

* PostgreSQL
* Change Log
* Sync Metadata

### Document Layer

* Paper Generation Engine
* QuestPDF Renderer

## High-Level Data Flow

User → SQLite → Sync Queue → Backend API → PostgreSQL

Backend → Change Log → Sync Download → SQLite
