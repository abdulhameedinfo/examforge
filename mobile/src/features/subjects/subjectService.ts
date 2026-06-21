import { OfflineMutationService } from '../../services/OfflineMutationService';

export class SubjectService {
  constructor(private readonly offline = new OfflineMutationService()) {}

  addSubject(input: {
    name: string;
    code: string;
    description?: string | null;
  }) {
    return this.offline.saveSubject(input);
  }

  updateSubject(input: {
    localId: string;
    serverId?: string | null;
    name: string;
    code: string;
    description?: string | null;
  }) {
    return this.offline.saveSubject(input);
  }

  deleteSubject(localId: string) {
    return this.offline.deleteSubject(localId);
  }
}

