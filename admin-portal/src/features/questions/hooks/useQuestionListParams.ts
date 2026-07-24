import { useSearchParams } from 'react-router-dom';
import type { QuestionListQuery, QuestionStatusValue, QuestionType } from '../types';

const defaultPageSize = 10;

function parseNumber(value: string | null, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function parseString(value: string | null) {
  return value?.trim() || undefined;
}

export function useQuestionListParams() {
  const [searchParams, setSearchParams] = useSearchParams();

  const query: QuestionListQuery = {
    pageNumber: parseNumber(searchParams.get('page'), 1),
    pageSize: parseNumber(searchParams.get('pageSize'), defaultPageSize),
    search: parseString(searchParams.get('search')),
    sortBy: parseString(searchParams.get('sortBy')),
    sortDirection: searchParams.get('sortDirection') === 'desc' ? 'desc' : 'asc',
    subjectId: parseString(searchParams.get('subjectId')),
    chapterId: parseString(searchParams.get('chapterId')),
    teacherId: parseString(searchParams.get('teacherId')),
    difficultyId: parseString(searchParams.get('difficultyId')),
    type: (parseString(searchParams.get('type')) as QuestionType | 'all' | undefined) ?? 'all',
    status: (parseString(searchParams.get('status')) as QuestionStatusValue | undefined) ?? 'all',
  };

  const setQueryParams = (updates: Partial<Record<keyof QuestionListQuery | 'page', string | number | undefined>>) => {
    const next = new URLSearchParams(searchParams);

    Object.entries(updates).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '') {
        next.delete(key);
      } else {
        next.set(key, String(value));
      }
    });

    setSearchParams(next);
  };

  const setPage = (page: number) => {
    setQueryParams({ page, pageSize: query.pageSize });
  };

  const setPageSize = (pageSize: number) => {
    setQueryParams({ page: 1, pageSize });
  };

  const setSearch = (search: string) => {
    setQueryParams({ page: 1, search });
  };

  const setFilters = (filters: Partial<Omit<QuestionListQuery, 'pageNumber' | 'pageSize'>>) => {
    setQueryParams({ page: 1, ...filters });
  };

  const clearFilters = () => {
    const next = new URLSearchParams();
    if (query.search) next.set('search', query.search);
    if (query.sortBy) next.set('sortBy', query.sortBy);
    if (query.sortDirection) next.set('sortDirection', query.sortDirection);
    next.set('page', String(query.pageNumber));
    next.set('pageSize', String(query.pageSize));
    setSearchParams(next);
  };

  return {
    query,
    setPage,
    setPageSize,
    setSearch,
    setFilters,
    clearFilters,
  };
}

