import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createTeacher,
  disableTeacher,
  getClassOptions,
  getSubjectOptions,
  getTeacher,
  getTeacherStatistics,
  getTeachers,
  updateTeacher,
} from '../api/teacherApi';
import type { TeacherListQuery, TeacherUpsertPayload } from '../types';

export const teacherQueryKeys = {
  all: ['teachers'] as const,
  list: (query: TeacherListQuery) => [...teacherQueryKeys.all, 'list', query] as const,
  detail: (teacherId: string) => [...teacherQueryKeys.all, 'detail', teacherId] as const,
  statistics: () => [...teacherQueryKeys.all, 'statistics'] as const,
  subjects: () => [...teacherQueryKeys.all, 'subjects'] as const,
  classes: () => [...teacherQueryKeys.all, 'classes'] as const,
};

export function useTeachersQuery(query: TeacherListQuery) {
  return useQuery({
    queryKey: teacherQueryKeys.list(query),
    queryFn: () => getTeachers(query),
    placeholderData: keepPreviousData,
  });
}

export function useTeacherQuery(teacherId?: string) {
  return useQuery({
    queryKey: teacherId ? teacherQueryKeys.detail(teacherId) : teacherQueryKeys.detail('missing'),
    queryFn: () => getTeacher(teacherId ?? ''),
    enabled: Boolean(teacherId),
  });
}

export function useTeacherStatisticsQuery() {
  return useQuery({
    queryKey: teacherQueryKeys.statistics(),
    queryFn: getTeacherStatistics,
    staleTime: 5 * 60 * 1000,
  });
}

export function useTeacherFormOptions() {
  const subjectsQuery = useQuery({
    queryKey: teacherQueryKeys.subjects(),
    queryFn: getSubjectOptions,
    staleTime: 10 * 60 * 1000,
  });

  const classesQuery = useQuery({
    queryKey: teacherQueryKeys.classes(),
    queryFn: getClassOptions,
    staleTime: 10 * 60 * 1000,
  });

  return {
    subjectsQuery,
    classesQuery,
  };
}

export function useCreateTeacherMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTeacher,
    onSuccess: async (createdTeacher) => {
      await queryClient.invalidateQueries({ queryKey: teacherQueryKeys.all });
      await queryClient.invalidateQueries({ queryKey: teacherQueryKeys.detail(createdTeacher.id) });
    },
  });
}

export function useUpdateTeacherMutation(teacherId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: TeacherUpsertPayload) => updateTeacher(teacherId, payload),
    onSuccess: async (updatedTeacher) => {
      await queryClient.invalidateQueries({ queryKey: teacherQueryKeys.all });
      await queryClient.invalidateQueries({ queryKey: teacherQueryKeys.detail(updatedTeacher.id) });
    },
  });
}

export function useDisableTeacherMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: disableTeacher,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: teacherQueryKeys.all });
      await queryClient.invalidateQueries({ queryKey: teacherQueryKeys.statistics() });
    },
  });
}
