import { apiClient } from '../../../shared/api/axiosClient';
import type {
  ExamPaperGeneratorPayload,
  GeneratedExamPaper,
} from '../types';

export async function generateExamPaper(payload: ExamPaperGeneratorPayload) {
  const response = await apiClient.post<GeneratedExamPaper>('/exam-papers/generate', payload);
  return response.data;
}

export async function getSubjectOptions() {
  const response = await apiClient.get('/subjects', {
    params: { pageNumber: 1, pageSize: 500, isActive: true },
  });
  return response.data.items;
}

export async function getClassOptions() {
  const response = await apiClient.get('/classes', {
    params: { pageNumber: 1, pageSize: 500, isActive: true },
  });
  return response.data.items;
}

export async function getTeacherOptions() {
  const response = await apiClient.get('/users', {
    params: { pageNumber: 1, pageSize: 500, role: 'Teacher', isActive: true },
  });
  return response.data.items;
}

export async function getDifficultyOptions() {
  const response = await apiClient.get('/difficulty-levels', {
    params: { pageNumber: 1, pageSize: 500, isActive: true },
  });
  return response.data.items;
}
