import { apiClient } from '../../../shared/api/axiosClient';
import type { PaginatedResponse } from '../../../shared/api/types';
import type {
  NamedEntity,
  QuestionDetail,
  QuestionListItem,
  QuestionListQuery,
  QuestionUpsertPayload,
  TeacherSummary,
} from '../types';

type SelectOptionResponse<TItem> = PaginatedResponse<TItem>;

export async function getQuestions(query: QuestionListQuery) {
  const response = await apiClient.get<PaginatedResponse<QuestionListItem>>('/questions', {
    params: query,
  });
  return response.data;
}

export async function getQuestion(questionId: string) {
  const response = await apiClient.get<QuestionDetail>(`/questions/${questionId}`);
  return response.data;
}

export async function createQuestion(payload: QuestionUpsertPayload) {
  const response = await apiClient.post<QuestionDetail>('/questions', payload);
  return response.data;
}

export async function updateQuestion(questionId: string, payload: QuestionUpsertPayload) {
  const response = await apiClient.put<QuestionDetail>(`/questions/${questionId}`, payload);
  return response.data;
}

export async function deleteQuestion(questionId: string) {
  await apiClient.delete(`/questions/${questionId}`);
}

export async function getSubjectOptions() {
  const response = await apiClient.get<SelectOptionResponse<NamedEntity>>('/subjects', {
    params: { pageNumber: 1, pageSize: 500, isActive: true },
  });

  return response.data.items;
}

export async function getChapterOptions(subjectId?: string) {
  const response = await apiClient.get<SelectOptionResponse<NamedEntity>>('/chapters', {
    params: { pageNumber: 1, pageSize: 500, subjectId, isActive: true },
  });

  return response.data.items;
}

export async function getDifficultyOptions() {
  const response = await apiClient.get<SelectOptionResponse<NamedEntity>>('/difficulty-levels', {
    params: { pageNumber: 1, pageSize: 500, isActive: true },
  });

  return response.data.items;
}

export async function getTeacherOptions() {
  const response = await apiClient.get<SelectOptionResponse<TeacherSummary>>('/users', {
    params: { pageNumber: 1, pageSize: 500, role: 'Teacher', isActive: true },
  });

  return response.data.items;
}
