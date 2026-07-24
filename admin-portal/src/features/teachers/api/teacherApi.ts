import type { IdNameDto, PaginatedResponse } from '../../../shared/api/types';
import { apiClient } from '../../../shared/api/axiosClient';
import type {
  TeacherDetail,
  TeacherListItem,
  TeacherListQuery,
  TeacherStatistics,
  TeacherUpsertPayload,
} from '../types';

type SelectOptionResponse<TItem> = PaginatedResponse<TItem>;

export async function getTeachers(query: TeacherListQuery) {
  const response = await apiClient.get<PaginatedResponse<TeacherListItem>>('/users', {
    params: {
      pageNumber: query.pageNumber,
      pageSize: query.pageSize,
      search: query.search,
      sortBy: query.sortBy,
      sortDirection: query.sortDirection,
      role: 'Teacher',
      subjectId: query.subjectId,
      classId: query.classId,
      isActive:
        query.status === 'all' ? undefined : query.status === 'active',
    },
  });

  return response.data;
}

export async function getTeacher(teacherId: string) {
  const response = await apiClient.get<TeacherDetail>(`/users/${teacherId}`);
  return response.data;
}

export async function createTeacher(payload: TeacherUpsertPayload) {
  const response = await apiClient.post<TeacherDetail>('/users', payload);
  return response.data;
}

export async function updateTeacher(teacherId: string, payload: TeacherUpsertPayload) {
  const response = await apiClient.put<TeacherDetail>(`/users/${teacherId}`, payload);
  return response.data;
}

export async function disableTeacher(teacherId: string) {
  await apiClient.patch(`/users/${teacherId}/disable`);
}

export async function getTeacherStatistics() {
  const response = await apiClient.get<TeacherStatistics>('/users/teacher-statistics', {
    params: { role: 'Teacher' },
  });

  return response.data;
}

export async function getSubjectOptions() {
  const response = await apiClient.get<SelectOptionResponse<IdNameDto>>('/subjects', {
    params: { pageNumber: 1, pageSize: 500, isActive: true },
  });

  return response.data.items;
}

export async function getClassOptions() {
  const response = await apiClient.get<SelectOptionResponse<IdNameDto>>('/classes', {
    params: { pageNumber: 1, pageSize: 500, isActive: true },
  });

  return response.data.items;
}
