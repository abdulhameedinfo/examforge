import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createQuestion,
  deleteQuestion,
  getChapterOptions,
  getDifficultyOptions,
  getQuestion,
  getQuestions,
  getSubjectOptions,
  getTeacherOptions,
  updateQuestion,
} from '../api/questionApi';
import type { QuestionListQuery, QuestionUpsertPayload } from '../types';

export const questionQueryKeys = {
  all: ['questions'] as const,
  list: (query: QuestionListQuery) => [...questionQueryKeys.all, 'list', query] as const,
  detail: (questionId: string) => [...questionQueryKeys.all, 'detail', questionId] as const,
  subjects: () => [...questionQueryKeys.all, 'subjects'] as const,
  chapters: (subjectId?: string) => [...questionQueryKeys.all, 'chapters', subjectId ?? 'all'] as const,
  difficulties: () => [...questionQueryKeys.all, 'difficulties'] as const,
  teachers: () => [...questionQueryKeys.all, 'teachers'] as const,
};

export function useQuestionsQuery(query: QuestionListQuery) {
  return useQuery({
    queryKey: questionQueryKeys.list(query),
    queryFn: () => getQuestions(query),
    placeholderData: keepPreviousData,
  });
}

export function useQuestionQuery(questionId?: string) {
  return useQuery({
    queryKey: questionId ? questionQueryKeys.detail(questionId) : questionQueryKeys.detail('missing'),
    queryFn: () => getQuestion(questionId ?? ''),
    enabled: Boolean(questionId),
  });
}

export function useQuestionFormOptions(subjectId?: string) {
  const subjectsQuery = useQuery({
    queryKey: questionQueryKeys.subjects(),
    queryFn: getSubjectOptions,
    staleTime: 10 * 60 * 1000,
  });

  const chaptersQuery = useQuery({
    queryKey: questionQueryKeys.chapters(subjectId),
    queryFn: () => getChapterOptions(subjectId),
    enabled: Boolean(subjectId),
    staleTime: 10 * 60 * 1000,
  });

  const difficultiesQuery = useQuery({
    queryKey: questionQueryKeys.difficulties(),
    queryFn: getDifficultyOptions,
    staleTime: 10 * 60 * 1000,
  });

  const teachersQuery = useQuery({
    queryKey: questionQueryKeys.teachers(),
    queryFn: getTeacherOptions,
    staleTime: 10 * 60 * 1000,
  });

  return {
    subjectsQuery,
    chaptersQuery,
    difficultiesQuery,
    teachersQuery,
  };
}

export function useCreateQuestionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createQuestion,
    onSuccess: async (createdQuestion) => {
      await queryClient.invalidateQueries({ queryKey: questionQueryKeys.all });
      await queryClient.invalidateQueries({ queryKey: questionQueryKeys.detail(createdQuestion.id) });
    },
  });
}

export function useUpdateQuestionMutation(questionId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: QuestionUpsertPayload) => updateQuestion(questionId, payload),
    onSuccess: async (updatedQuestion) => {
      await queryClient.invalidateQueries({ queryKey: questionQueryKeys.all });
      await queryClient.invalidateQueries({ queryKey: questionQueryKeys.detail(updatedQuestion.id) });
    },
  });
}

export function useDeleteQuestionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteQuestion,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: questionQueryKeys.all });
    },
  });
}
