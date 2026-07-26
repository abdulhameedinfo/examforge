import { BaseApiService } from '../../../shared/api/BaseApiService';
import type { PaginatedResponse } from '../../../shared/api/types';

export interface Teacher {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  subjectIds: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTeacherPayload {
  fullName: string;
  email: string;
  phone?: string;
  subjectIds: string[];
}

export interface UpdateTeacherPayload {
  fullName?: string;
  email?: string;
  phone?: string;
  subjectIds?: string[];
  isActive?: boolean;
}

export class TeachersApiService extends BaseApiService {
  constructor() {
    super('/teachers');
  }

  async getTeachers(params?: {
    pageNumber?: number;
    pageSize?: number;
    search?: string;
    subjectId?: string;
    isActive?: boolean;
  }) {
    return this.getPaginated<Teacher>('', params);
  }

  async getTeacher(id: string) {
    return this.get<Teacher>(`/${id}`);
  }

  async createTeacher(payload: CreateTeacherPayload) {
    return this.post<Teacher>('', payload);
  }

  async updateTeacher(id: string, payload: UpdateTeacherPayload) {
    return this.put<Teacher>(`/${id}`, payload);
  }

  async deleteTeacher(id: string) {
    return this.delete<void>(`/${id}`);
  }

  async getTeacherQuestions(id: string, params?: {
    pageNumber?: number;
    pageSize?: number;
  }) {
    return this.getPaginated<Teacher>(`/${id}/questions`, params);
  }
}

export const teachersApi = new TeachersApiService();
