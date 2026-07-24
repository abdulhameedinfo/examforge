import { useSearchParams } from 'react-router-dom';
import type { SubjectListQuery } from '../types';

const defaultPageSize = 10;

function parseNumber(value: string | null, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function parseString(value: string | null) {
  return value?.trim() || undefined;
}

export function useSubjectListParams() {
  const [searchParams, setSearchParams] = useSearchParams();

  const query: SubjectListQuery = {
    pageNumber: parseNumber(searchParams.get('page'), 1),
    pageSize: parseNumber(searchParams.get('pageSize'), defaultPageSize),
    search: parseString(searchParams.get('search')),
    sortBy: parseString(searchParams.get('sortBy')),
    sortDirection: searchParams.get('sortDirection') === 'desc' ? 'desc' : 'asc',
  };

  const setQueryParams = (updates: Partial<Record<keyof SubjectListQuery | 'page', string | number | undefined>>) => {
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

  const setSort = (sortBy: string, sortDirection: 'asc' | 'desc') => {
    setQueryParams({ page: 1, sortBy, sortDirection });
  };

  return {
    query,
    setPage,
    setPageSize,
    setSearch,
    setSort,
  };
}

