# Database Design

## Subjects

| Column    | Type    |
| --------- | ------- |
| Id        | UUID    |
| Name      | VARCHAR |
| Version   | INT     |
| IsDeleted | BOOLEAN |

## Questions

| Column       | Type    |
| ------------ | ------- |
| Id           | UUID    |
| SubjectId    | UUID    |
| TeacherId    | UUID    |
| QuestionType | INT     |
| Text         | TEXT    |
| Marks        | INT     |
| Version      | INT     |
| IsDeleted    | BOOLEAN |

## Papers

| Column      | Type      |
| ----------- | --------- |
| Id          | UUID      |
| SubjectId   | UUID      |
| CreatedBy   | UUID      |
| GeneratedAt | TIMESTAMP |

## PaperQuestions

| Column     | Type |
| ---------- | ---- |
| PaperId    | UUID |
| QuestionId | UUID |

## ChangeLog

| Column     | Type      |
| ---------- | --------- |
| Token      | BIGINT    |
| EntityType | VARCHAR   |
| EntityId   | UUID      |
| Operation  | VARCHAR   |
| ChangedAt  | TIMESTAMP |

## Relationships

Subject → Questions

Paper → PaperQuestions

Question → PaperQuestions
