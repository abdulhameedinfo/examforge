import { useMutation, useQuery } from '@tanstack/react-query';
import {
  getClassOptions,
  getDifficultyOptions,
  getSubjectOptions,
  getTeacherOptions,
  generateExamPaper,
} from '../api/paperApi';
import type { ExamPaperGeneratorPayload } from '../types';

export const paperQueryKeys = {
  all: ['papers'] as const,
  subjects: () => [...paperQueryKeys.all, 'subjects'] as const,
  classes: () => [...paperQueryKeys.all, 'classes'] as const,
  teachers: () => [...paperQueryKeys.all, 'teachers'] as const,
  difficulties: () => [...paperQueryKeys.all, 'difficulties'] as const,
};

export function usePaperFormOptions() {
  const subjectsQuery = useQuery({
    queryKey: paperQueryKeys.subjects(),
    queryFn: getSubjectOptions,
    staleTime: 10 * 60 * 1000,
  });

  const classesQuery = useQuery({
    queryKey: paperQueryKeys.classes(),
    queryFn: getClassOptions,
    staleTime: 10 * 60 * 1000,
  });

  const teachersQuery = useQuery({
    queryKey: paperQueryKeys.teachers(),
    queryFn: getTeacherOptions,
    staleTime: 10 * 60 * 1000,
  });

  const difficultiesQuery = useQuery({
    queryKey: paperQueryKeys.difficulties(),
    queryFn: getDifficultyOptions,
    staleTime: 10 * 60 * 1000,
  });

  return {
    subjectsQuery,
    classesQuery,
    teachersQuery,
    difficultiesQuery,
  };
}

export function useGeneratePaperMutation() {
  return useMutation({
    mutationFn: (payload: ExamPaperGeneratorPayload) => generateExamPaper(payload),
  });
}
