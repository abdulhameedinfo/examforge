import { initializeSchema } from '../../db';
import { SubjectService } from '../../features/subjects/subjectService';
import { QuestionService } from '../../features/questions/questionService';
import { AppSyncService } from '../../features/sync/syncService';

export async function createAppContext(input: {
  apiBaseUrl: string;
  deviceId: string;
}) {
  await initializeSchema();

  return {
    subjects: new SubjectService(),
    questions: new QuestionService(),
    sync: new AppSyncService(input.apiBaseUrl, input.deviceId),
  };
}

