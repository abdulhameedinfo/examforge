import { SubjectRepository } from '../repositories/SubjectRepository';
import { QuestionRepository } from '../repositories/QuestionRepository';
import { SyncQueueRepository } from '../repositories/SyncQueueRepository';

function nowUtc(): string {
  return new Date().toISOString();
}

export class OfflineMutationService {
  constructor(
    private readonly subjects = new SubjectRepository(),
    private readonly questions = new QuestionRepository(),
    private readonly queue = new SyncQueueRepository(),
  ) {}

  async saveSubject(input: {
    localId?: string;
    serverId?: string | null;
    name: string;
    code: string;
    description?: string | null;
  }): Promise<string> {
    const existing = input.localId ? await this.subjects.getByLocalId(input.localId) : null;
    const localId = await this.subjects.upsertLocal({
      localId: input.localId,
      serverId: input.serverId ?? existing?.serverId ?? null,
      name: input.name,
      code: input.code,
      description: input.description ?? null,
      version: existing?.version ?? 0,
      isSynced: 0,
    });

    await this.queue.enqueue({
      entityType: 'subject',
      entityLocalId: localId,
      operation: 'upsert',
      baseVersion: existing?.version ?? 0,
      payload: {
        localId,
        serverId: input.serverId ?? existing?.serverId ?? null,
        name: input.name,
        code: input.code,
        description: input.description ?? null,
        updatedAt: nowUtc(),
        isDeleted: false,
      },
    });

    return localId;
  }

  async deleteSubject(localId: string): Promise<void> {
    const existing = await this.subjects.getByLocalId(localId);
    if (!existing) {
      return;
    }

    await this.subjects.softDelete(localId);
    await this.queue.enqueue({
      entityType: 'subject',
      entityLocalId: localId,
      operation: 'delete',
      baseVersion: existing.version,
      payload: { localId, serverId: existing.serverId, isDeleted: true, updatedAt: nowUtc() },
    });
  }

  async saveQuestion(input: {
    localId?: string;
    serverId?: string | null;
    subjectLocalId: string;
    subjectServerId?: string | null;
    title: string;
    body?: string | null;
    answer?: string | null;
    questionType: string;
  }): Promise<string> {
    const existing = input.localId ? await this.questions.getByLocalId(input.localId) : null;
    const localId = await this.questions.upsertLocal({
      localId: input.localId,
      serverId: input.serverId ?? existing?.serverId ?? null,
      subjectLocalId: input.subjectLocalId,
      subjectServerId: input.subjectServerId ?? existing?.subjectServerId ?? null,
      title: input.title,
      body: input.body ?? null,
      answer: input.answer ?? null,
      questionType: input.questionType,
      version: existing?.version ?? 0,
      isSynced: 0,
    });

    await this.queue.enqueue({
      entityType: 'question',
      entityLocalId: localId,
      operation: 'upsert',
      baseVersion: existing?.version ?? 0,
      payload: {
        localId,
        serverId: input.serverId ?? existing?.serverId ?? null,
        subjectLocalId: input.subjectLocalId,
        subjectServerId: input.subjectServerId ?? existing?.subjectServerId ?? null,
        title: input.title,
        body: input.body ?? null,
        answer: input.answer ?? null,
        questionType: input.questionType,
        updatedAt: nowUtc(),
        isDeleted: false,
      },
    });

    return localId;
  }

  async deleteQuestion(localId: string): Promise<void> {
    const existing = await this.questions.getByLocalId(localId);
    if (!existing) {
      return;
    }

    await this.questions.softDelete(localId);
    await this.queue.enqueue({
      entityType: 'question',
      entityLocalId: localId,
      operation: 'delete',
      baseVersion: existing.version,
      payload: { localId, serverId: existing.serverId, isDeleted: true, updatedAt: nowUtc() },
    });
  }
}
