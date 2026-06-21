import { OfflineMutationService } from '../../services/OfflineMutationService';

export class QuestionService {
  constructor(private readonly offline = new OfflineMutationService()) {}

  addQuestion(input: {
    subjectLocalId: string;
    subjectServerId?: string | null;
    title: string;
    body?: string | null;
    answer?: string | null;
    questionType: string;
  }) {
    return this.offline.saveQuestion(input);
  }

  updateQuestion(input: {
    localId: string;
    serverId?: string | null;
    subjectLocalId: string;
    subjectServerId?: string | null;
    title: string;
    body?: string | null;
    answer?: string | null;
    questionType: string;
  }) {
    return this.offline.saveQuestion(input);
  }

  deleteQuestion(localId: string) {
    return this.offline.deleteQuestion(localId);
  }
}

