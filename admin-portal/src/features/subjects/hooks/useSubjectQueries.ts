import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createSubject,
  deleteSubject,
  getSubject,
  getSubjects,
  updateSubject,
} from '../api/subjectApi';
import type { SubjectListQuery, SubjectUpsertPayload } from '../types';

export const subjectQueryKeys = {
  all: ['subjects'] as const,
  list: (query: SubjectListQuery) => [...subjectQueryKeys.all, 'list', query] as const,
  detail: (subjectId: string) => [...subjectQueryKeys.all, 'detail', subjectId] as const,
};

export function useSubjectsQuery(query: SubjectListQuery) {
  return useQuery({
    queryKey: subjectQueryKeys.list(query),
    queryFn: () => getSubjects(query),
    placeholderData: keepPreviousData,
  });
}

export function useSubjectQuery(subjectId?: string) {
  return useQuery({
    queryKey: subjectId ? subjectQueryKeys.detail(subjectId) : subjectQueryKeys.detail('missing'),
    queryFn: () => getSubject(subjectId ?? ''),
    enabled: Boolean(subjectId),
  });
}

export function useCreateSubjectMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createSubject,
    onSuccess: async (createdSubject) => {
      await queryClient.invalidateQueries({ queryKey: subjectQueryKeys.all });
      await queryClient.invalidateQueries({ queryKey: subjectQueryKeys.detail(createdSubject.id) });
    },
  });
}

export function useUpdateSubjectMutation(subjectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: SubjectUpsertPayload) => updateSubject(subjectId, payload),
    onSuccess: async (updatedSubject) => {
      await queryClient.invalidateQueries({ queryKey: subjectQueryKeys.all });
      await queryClient.invalidateQueries({ queryKey: subjectQueryKeys.detail(updatedSubject.id) });
    },
  });
}

export function useDeleteSubjectMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteSubject,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: subjectQueryKeys.all });
    },
  });
}

