# Authorization

## Authentication

JWT Bearer Authentication

## Roles

### Teacher

Permissions:

* View Subjects
* Create Questions
* Edit Own Questions
* Delete Own Questions
* Generate Papers
* Download PDFs

### Administrator

Permissions:

* Manage Subjects
* Manage Question Bank
* Generate Papers
* Download PDFs
* Resolve Conflicts
* Manage Users

## Enforcement

Authorization must be enforced by the backend API.

The mobile application should never be trusted for security decisions.
