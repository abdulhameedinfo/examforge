import { apiClient } from '../../../shared/api/axiosClient';
import type { PaginatedResponse } from '../../../shared/api/types';
import type {
  SubjectDetail,
  SubjectListItem,
  SubjectListQuery,
  SubjectUpsertPayload,
} from '../types';

export async function getSubjects(query: SubjectListQuery) {
  const response = await apiClient.get<PaginatedResponse<SubjectListItem>>('/subjects', {
    params: query,
  });

  return response.data;
}

export async function getSubject(subjectId: string) {
  const response = await apiClient.get<SubjectDetail>(`/subjects/${subjectId}`);
  return response.data;
}

export async function createSubject(payload: SubjectUpsertPayload) {
  const response = await apiClient.post<SubjectDetail>('/subjects', payload);
  return response.data;
}

export async function updateSubject(subjectId: string, payload: SubjectUpsertPayload) {
  const response = await apiClient.put<SubjectDetail>(`/subjects/${subjectId}`, payload);
  return response.data;
}

export async function deleteSubject(subjectId: string) {
  await apiClient.delete(`/subjects/${subjectId}`);
}

