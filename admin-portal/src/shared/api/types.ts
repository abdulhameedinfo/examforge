export type ApiErrorResponse = {
  message: string;
  code?: string;
  details?: Record<string, string[]>;
  statusCode?: number;
  timestamp?: string;
  path?: string;
};

export type PaginatedResponse<TItem> = {
  items: TItem[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
};

export type IdNameDto = {
  id: string;
  name: string;
};

export type ApiRequestConfig = {
  skipAuth?: boolean;
  skipGlobalErrorHandling?: boolean;
  retryCount?: number;
  signal?: AbortSignal;
};

export type ApiResponse<T> = {
  data: T;
  success: boolean;
  message?: string;
};

export type ApiErrorType = 'network' | 'server' | 'client' | 'auth' | 'validation' | 'unknown';

export type ApiError = {
  type: ApiErrorType;
  message: string;
  statusCode?: number;
  details?: Record<string, string[]>;
  originalError?: unknown;
};

