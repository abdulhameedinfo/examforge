import { BaseApiService } from '../../../shared/api/BaseApiService';
import type { QuestionListItem, QuestionDetail, QuestionListQuery, QuestionUpsertPayload, QuestionStatistics } from '../types';

export class QuestionsApiService extends BaseApiService {
  constructor() {
    super('/questions');
  }

  async getQuestions(query: QuestionListQuery) {
    return this.getPaginated<QuestionListItem>('', query);
  }

  async getQuestion(id: string) {
    return this.get<QuestionDetail>(`/${id}`);
  }

  async createQuestion(payload: QuestionUpsertPayload) {
    return this.post<QuestionDetail>('', payload);
  }

  async updateQuestion(id: string, payload: QuestionUpsertPayload) {
    return this.put<QuestionDetail>(`/${id}`, payload);
  }

  async deleteQuestion(id: string) {
    return this.delete<void>(`/${id}`);
  }

  async getStatistics() {
    return this.get<QuestionStatistics>('/statistics');
  }

  async bulkDelete(ids: string[]) {
    return this.post<void>('/bulk-delete', { ids });
  }

  async exportQuestions(query: QuestionListQuery) {
    return this.downloadFile('/export', 'questions.xlsx', query);
  }
}

export const questionsApi = new QuestionsApiService();
