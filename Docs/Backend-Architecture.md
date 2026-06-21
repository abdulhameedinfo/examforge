# Backend Architecture

## Architecture Style

Clean Architecture

## Layers

### API Layer

Responsibilities:

* Authentication
* Authorization
* Controllers
* Request Validation
* Response Handling

### Application Layer

Responsibilities:

* Use Cases
* Commands
* Queries
* Validation
* Synchronization Services
* Paper Generation Coordination

### Domain Layer

Responsibilities:

* Business Rules
* Entities
* Value Objects
* Domain Services

Core Entities:

* User
* Subject
* Question
* Paper
* PaperSection

### Persistence Layer

Responsibilities:

* EF Core
* Repository Implementations
* Migrations
* Database Access

### Infrastructure Layer

Responsibilities:

* QuestPDF
* Logging
* Storage Integrations
* External Services

## Design Principles

* Dependency Inversion
* Separation of Concerns
* Testability
* Maintainability
